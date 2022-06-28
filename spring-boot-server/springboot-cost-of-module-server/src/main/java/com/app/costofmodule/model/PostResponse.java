package com.app.costofmodule.model;

public class PostResponse {
    private Object responseData;
    private String errorMessage;
    private String statuCode;

    public Object getResponseData() {
        return responseData;
    }

    public void setResponseData(Object responseData) {
        this.responseData = responseData;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public String getStatuCode() {
        return statuCode;
    }

    public void setStatuCode(String statuCode) {
        this.statuCode = statuCode;
    }
}
