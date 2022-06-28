package com.app.costofmodule.service;

import com.app.costofmodule.model.AllVersionsDetails;
import com.app.costofmodule.model.Post;

public interface PostService {

    Object[] getPackageSuggestions(String packageName);

    AllVersionsDetails[] getPackageMetadata(String name);
}
