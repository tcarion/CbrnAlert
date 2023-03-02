# Atp45Api

All URIs are relative to *http://localhost:8000/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**atp45_run_post**](Atp45Api.md#atp45_run_post) | **POST** /atp45/run | 
[**atp45_tree_get**](Atp45Api.md#atp45_tree_get) | **GET** /atp45/tree | 
[**forecast_available_get**](Atp45Api.md#forecast_available_get) | **GET** /forecast/available | 


# **atp45_run_post**
> atp45_run_post(req::HTTP.Request, weathertype::Atp45RunTypes, atp45_input::Atp45Input;) -> Atp45Result



### Required Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **req** | **HTTP.Request** | The HTTP Request object | 
**weathertype** | [**Atp45RunTypes**](.md)| Determine if the weather conditions are retrieved in archive forecasts (&#x60;archive&#x60;), in latest forecast (&#x60;forecast&#x60;) or are provided in the request (&#x60;manually&#x60;) | [default to nothing]
**atp45_input** | [**Atp45Input**](Atp45Input.md)|  | 

### Return type

[**Atp45Result**](Atp45Result.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **atp45_tree_get**
> atp45_tree_get(req::HTTP.Request;) -> Atp45DecisionTree



Get the decision tree discriminating between the ATP-45 cases.

### Required Parameters
This endpoint does not need any parameter.

### Return type

[**Atp45DecisionTree**](Atp45DecisionTree.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **forecast_available_get**
> forecast_available_get(req::HTTP.Request;) -> ForecastAvailableSteps



Return the last forecast datetimes available at ECMWF

### Required Parameters
This endpoint does not need any parameter.

### Return type

[**ForecastAvailableSteps**](ForecastAvailableSteps.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

