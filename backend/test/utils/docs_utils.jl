using Main.UserApp: API_DOC_FILE
using YAML
using Test

# const API_DOCS = YAML.load_file(joinpath("..", API_DOC_FILE); dicttype=Dict{String, Any})
const API_DOCS = YAML.load_file(joinpath("..", "public", "docs", "api_docs.yaml"); dicttype=Dict{String, Any})


function response_schema(testroute; method = "get", response = "200", only_required = true)
    method = lowercase(method)
    method in ["get", "post"] || error("method $method not knon")
    schema = API_DOCS["paths"][testroute][method]["responses"][response]["content"]["application/json"]["schema"]
    schema_to_dict(schema; only_required)
end

function body_schema(testroute)
    schema = API_DOCS["paths"][testroute]["post"]["requestBody"]["content"]["application/json"]["schema"]
    schema_to_dict(schema)
end

function post_response_schema(testroute; response = "200")
    response_schema(testroute; method = "post", response)
end

get_schema(name) = API_DOCS["components"]["schemas"][name]

"""
    At the moment, it only compares the first keys of the Dict. Should check recursively for nested objects.
"""
function follows_spec(testroute, result; method = :GET)
    method = string(method)
    schema = if method == "GET"
        response_schema(testroute)
    elseif method == "POST"
        post_response_schema(testroute)
    else
        error("method $method is not known")
    end

    if schema isa AbstractVector
        @test result isa AbstractVector
        result = result[1]
        schema = schema[1]
    end

    @test keys(result) == Set(Symbol.(keys(schema)))
end

function keys_in(schema, result)
    try
        throws_keys_in(schema, result)
    catch _
        false
    end
end

function throws_keys_in(schema, result)
    if schema isa AbstractVector
        if !(result isa AbstractVector)
            error("Both structs are different")
        end
        return keys_in(schema[1], result[1])
    end
    schkeys = Set(Symbol.(keys(schema)))
    reskeys = Set(Symbol.(keys(result)))
    # check if all the properties required by the scheme are in the result
    isin = all(in.(schkeys, Ref(reskeys)))
    if isin
        for (k, v) in schema
            if v isa AbstractDict
                return keys_in(schema[k], result[k])
            else
                return true
            end
        end
    else
        error("Both structs are different")
    end
end
"""
    Fails if `only_required == true` and some nested schema has no required properties.
"""
function schema_to_dict(schema, dict = Dict{String, Any}(); only_required = true)
    ref = get(schema, "\$ref", nothing)
    if !isnothing(ref)
        schema_name = basename(ref)
        inner_schema = get_schema(schema_name)
       return schema_to_dict(inner_schema, dict; only_required)
    end

    allofs = get(schema, "allOf", nothing)
    if !isnothing(allofs)
        for allof in allofs
            if !get(allof, "nullable", false)
                inner_schema = schema_to_dict(allof; only_required)
                if isempty(inner_schema)
                    continue
                else
                    push!(dict, schema_to_dict(allof; only_required)...)
                end
            end
        end
    end

    type = get(schema, "type", nothing)
    if type == "object"
        if only_required
            required = get(schema, "required", nothing)
            if !isnothing(required)
                reqkeys = schema["required"]
                for reqkey in reqkeys
                    try
                        dict[reqkey] = schema_to_dict(schema["properties"][reqkey]; only_required)
                    catch e
                        if e isa KeyError
                            error("Key $reqkey is required but is not in the properties (only $(collect(keys(schema["properties"]))))")
                        end
                        rethrow(e)
                    end
                end
            end

            if isnothing(required)
                # This is wrong, has it will try to push an empty Dict if no properties are required in a schema. Don't know what to do in this case
                dict
            end
        else
            allproperties = get(schema, "properties", nothing)
            if !isnothing(allproperties)
                for prop in keys(allproperties)
                    dict[prop] = schema_to_dict(schema["properties"][prop]; only_required)
                end
            end
        end
    end
    if type == "array"
        inner_schema = schema["items"]
        return [schema_to_dict(inner_schema; only_required)]
    end
    if type == "number" || type == "string" 
        example = if haskey(schema, "default")
            schema["default"]
        elseif haskey(schema, "example")
            schema["example"]
        else
            _default_val(type)
        end
        return example
    end
    return dict
end

_default_val(type) = if type == "number"
    0.0
elseif type == "string"
    ""
end 