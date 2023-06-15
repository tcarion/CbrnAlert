# FlexpartApi

All URIs are relative to *http://localhost:8000/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**flexpart_input_post**](FlexpartApi.md#flexpart_input_post) | **POST** /flexpart/input | 
[**flexpart_inputs_get**](FlexpartApi.md#flexpart_inputs_get) | **GET** /flexpart/inputs | 
[**flexpart_inputs_input_id_delete**](FlexpartApi.md#flexpart_inputs_input_id_delete) | **DELETE** /flexpart/inputs/{inputId} | 
[**flexpart_inputs_input_id_get**](FlexpartApi.md#flexpart_inputs_input_id_get) | **GET** /flexpart/inputs/{inputId} | 
[**flexpart_outputs_output_id_dimensions_get**](FlexpartApi.md#flexpart_outputs_output_id_dimensions_get) | **GET** /flexpart/outputs/{outputId}/dimensions | 
[**flexpart_outputs_output_id_get**](FlexpartApi.md#flexpart_outputs_output_id_get) | **GET** /flexpart/outputs/{outputId} | 
[**flexpart_outputs_output_id_layers_get**](FlexpartApi.md#flexpart_outputs_output_id_layers_get) | **GET** /flexpart/outputs/{outputId}/layers | 
[**flexpart_outputs_output_id_slice_post**](FlexpartApi.md#flexpart_outputs_output_id_slice_post) | **POST** /flexpart/outputs/{outputId}/slice | 
[**flexpart_run_post**](FlexpartApi.md#flexpart_run_post) | **POST** /flexpart/run | 
[**flexpart_runs_get**](FlexpartApi.md#flexpart_runs_get) | **GET** /flexpart/runs | 
[**flexpart_runs_run_id_delete**](FlexpartApi.md#flexpart_runs_run_id_delete) | **DELETE** /flexpart/runs/{runId} | 
[**flexpart_runs_run_id_get**](FlexpartApi.md#flexpart_runs_run_id_get) | **GET** /flexpart/runs/{runId} | 
[**flexpart_runs_run_id_outputs_get**](FlexpartApi.md#flexpart_runs_run_id_outputs_get) | **GET** /flexpart/runs/{runId}/outputs | 


# **flexpart_input_post**
> flexpart_input_post(req::HTTP.Request, flexpart_input_post_request::FlexpartInputPostRequest; retrieval_type=nothing,) -> FlexpartInput



Retrieve the meteorological data needed for flexpart

### Required Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **req** | **HTTP.Request** | The HTTP Request object | 
**flexpart_input_post_request** | [**FlexpartInputPostRequest**](FlexpartInputPostRequest.md)|  | 

### Optional Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **retrieval_type** | **String**| If &#x60;simple&#x60;, use the simplified options structure defined by &#x60;FlexpartRetrieveSimple&#x60;. If &#x60;detailed&#x60;, a full Flexpart options object is expected (see Flexpart docs) | [default to simple]

### Return type

[**FlexpartInput**](FlexpartInput.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **flexpart_inputs_get**
> flexpart_inputs_get(req::HTTP.Request; status=nothing,) -> Vector{FlexpartInput}



Return all the Flexpart inputs available (default finished)

### Required Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **req** | **HTTP.Request** | The HTTP Request object | 

### Optional Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **status** | [**RunStatus**](.md)|  | [default to nothing]

### Return type

[**Vector{FlexpartInput}**](FlexpartInput.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **flexpart_inputs_input_id_delete**
> flexpart_inputs_input_id_delete(req::HTTP.Request, input_id::String;) -> FlexpartInput



### Required Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **req** | **HTTP.Request** | The HTTP Request object | 
**input_id** | **String**| The input ID | [default to nothing]

### Return type

[**FlexpartInput**](FlexpartInput.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **flexpart_inputs_input_id_get**
> flexpart_inputs_input_id_get(req::HTTP.Request, input_id::String;) -> FlexpartInput



### Required Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **req** | **HTTP.Request** | The HTTP Request object | 
**input_id** | **String**| The input ID | [default to nothing]

### Return type

[**FlexpartInput**](FlexpartInput.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **flexpart_outputs_output_id_dimensions_get**
> flexpart_outputs_output_id_dimensions_get(req::HTTP.Request, output_id::String; layer=nothing, horizontal=nothing,) -> Any



Return the dimensions layers of the Flexpart output `outputId` with their values

### Required Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **req** | **HTTP.Request** | The HTTP Request object | 
**output_id** | **String**| The output ID | [default to nothing]

### Optional Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **layer** | **String**| If the name of the layer is given, only returns the dimensions of the layer | [default to nothing]
 **horizontal** | **Bool**| If false, don&#39;t return the horizontal dimensions (lons and lats) | [default to false]

### Return type

**Any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **flexpart_outputs_output_id_get**
> flexpart_outputs_output_id_get(req::HTTP.Request, output_id::String;) -> FlexpartOutput



### Required Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **req** | **HTTP.Request** | The HTTP Request object | 
**output_id** | **String**| The output ID | [default to nothing]

### Return type

[**FlexpartOutput**](FlexpartOutput.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **flexpart_outputs_output_id_layers_get**
> flexpart_outputs_output_id_layers_get(req::HTTP.Request, output_id::String; spatial=nothing,) -> Vector{String}



Return the layers of the Flexpart output `outputId`

### Required Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **req** | **HTTP.Request** | The HTTP Request object | 
**output_id** | **String**| The output ID | [default to nothing]

### Optional Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spatial** | **Bool**| If only spatial layers must be retrieved | [default to false]

### Return type

**Vector{String}**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **flexpart_outputs_output_id_slice_post**
> flexpart_outputs_output_id_slice_post(req::HTTP.Request, layer::String, output_id::String, body::Any; geojson=nothing, legend=nothing,) -> FlexpartOutputsOutputIdSlicePost200Response



Return a slice of the `output` according to some dimensions.

### Required Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **req** | **HTTP.Request** | The HTTP Request object | 
**layer** | **String**| Name of the layer to slice | [default to nothing]
**output_id** | **String**| The output ID | [default to nothing]
**body** | **Any**| dimensions to be sliced along | 

### Optional Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **geojson** | **Bool**| If true, the output is given in geojson format. The sliced layer must be a surface. | [default to false]
 **legend** | **Bool**| If true, data for legend is provided | [default to false]

### Return type

[**FlexpartOutputsOutputIdSlicePost200Response**](FlexpartOutputsOutputIdSlicePost200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json, image/tiff

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **flexpart_run_post**
> flexpart_run_post(req::HTTP.Request, input_id::String, flexpart_run_post_request::FlexpartRunPostRequest; run_type=nothing,) -> FlexpartRun



Run flexpart

### Required Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **req** | **HTTP.Request** | The HTTP Request object | 
**input_id** | **String**| Input id | [default to nothing]
**flexpart_run_post_request** | [**FlexpartRunPostRequest**](FlexpartRunPostRequest.md)| Options for Flexpart. | 

### Optional Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **run_type** | **String**| If &#x60;simple&#x60;, use the simplified options structure defined by &#x60;FlexpartOptionsSimple&#x60;. If &#x60;detailed&#x60;, a full Flexpart options object is expected (see Flexpart docs) | [default to simple]

### Return type

[**FlexpartRun**](FlexpartRun.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **flexpart_runs_get**
> flexpart_runs_get(req::HTTP.Request; status=nothing,) -> Vector{FlexpartRun}



Return all the Flexpart runs (default finished)

### Required Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **req** | **HTTP.Request** | The HTTP Request object | 

### Optional Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **status** | [**RunStatus**](.md)|  | [default to nothing]

### Return type

[**Vector{FlexpartRun}**](FlexpartRun.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **flexpart_runs_run_id_delete**
> flexpart_runs_run_id_delete(req::HTTP.Request, run_id::String;) -> FlexpartRun



### Required Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **req** | **HTTP.Request** | The HTTP Request object | 
**run_id** | **String**| The flexpart run ID | [default to nothing]

### Return type

[**FlexpartRun**](FlexpartRun.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **flexpart_runs_run_id_get**
> flexpart_runs_run_id_get(req::HTTP.Request, run_id::String;) -> FlexpartRun



### Required Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **req** | **HTTP.Request** | The HTTP Request object | 
**run_id** | **String**| The flexpart run ID | [default to nothing]

### Return type

[**FlexpartRun**](FlexpartRun.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **flexpart_runs_run_id_outputs_get**
> flexpart_runs_run_id_outputs_get(req::HTTP.Request, run_id::String;) -> Vector{FlexpartOutput}



Return the outputs of the Flexpart run `runId`

### Required Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **req** | **HTTP.Request** | The HTTP Request object | 
**run_id** | **String**| The flexpart run ID | [default to nothing]

### Return type

[**Vector{FlexpartOutput}**](FlexpartOutput.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

