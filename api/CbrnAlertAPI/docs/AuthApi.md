# AuthApi

All URIs are relative to *http://localhost:8000/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**login_post**](AuthApi.md#login_post) | **POST** /login | 


# **login_post**
> login_post(req::HTTP.Request, login_post_request::LoginPostRequest;) -> LoginPost200Response



Authentication request

### Required Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **req** | **HTTP.Request** | The HTTP Request object | 
**login_post_request** | [**LoginPostRequest**](LoginPostRequest.md)|  | 

### Return type

[**LoginPost200Response**](LoginPost200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

