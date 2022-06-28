package com.app.costofmodule.utils;

import com.app.costofmodule.exception.InvalidRequestException;
import org.springframework.util.StringUtils;

public class ValidationUtils {
    public static final void validateString(String value) throws InvalidRequestException
    {
        if(StringUtils.isEmpty(value))
        {
            throw new InvalidRequestException("Value cannot be null");
        }
    }
}
