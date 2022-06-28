package com.app.costofmodule.service.impl;

import com.app.costofmodule.model.AllVersionsDetails;
import com.app.costofmodule.model.MinifiedJS;
import com.app.costofmodule.model.Post;
import com.app.costofmodule.service.PostService;
import com.app.costofmodule.utils.GZIPCompression;
import com.app.costofmodule.utils.ZipModule;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class PostServiceImpl implements PostService {

    Logger logger = LoggerFactory.getLogger(PostServiceImpl.class);
    @Autowired
    RestTemplate template;

    @Value("${npm.query.url}")
    private String npmQuery;

    @Value("${npm.repository}")
    private String npmRepository;

    @Override
    public Object[] getPackageSuggestions(String packageName) {
        Object[] responseArray = template.getForObject(npmQuery +packageName, Object[].class);
        return responseArray;
    }

    @Override
    public AllVersionsDetails[] getPackageMetadata(String name) {
        try {
            RequestEntity<Void> request = RequestEntity.get(new java.net.URI(npmRepository+name))
                    .accept(MediaType.APPLICATION_JSON).build();
            Map<String, Map> jsonDictionary = (Map<String, Map>) template.getForObject(npmRepository+name, Map.class);
            Map <String, Map> versions = jsonDictionary.get("versions");
            logger.info(jsonDictionary.get("time").getClass().getName());
            LinkedHashMap<String, String> time = (LinkedHashMap<String, String>) jsonDictionary.get("time");
            Object[] objects = time.keySet().toArray();
            String key = null;
            AllVersionsDetails lastReleaseVersions[] = new AllVersionsDetails[4];
            int maxCapacity = 2;
            for(int i=objects.length-1;i>=0;i--)
            {
                key = (String) objects[i];
                if(key.contains("-"))
                {
                    continue;
                }
                if(maxCapacity>=0) {
                    AllVersionsDetails allVersionsDetails = getAllVersionDetails(versions, key, name);
                    lastReleaseVersions[maxCapacity--] = allVersionsDetails;
                    logger.info("allVersionsDetails="+ allVersionsDetails);
                }
            }
            String previousRelease = getPreviousMajorRelease(objects, lastReleaseVersions[2].getVersion());
            lastReleaseVersions[3] = getAllVersionDetails(versions, previousRelease, name);

            return lastReleaseVersions;
        } catch (URISyntaxException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    private AllVersionsDetails getAllVersionDetails(Map <String, Map> versions, String key, String name) throws IOException {
        String tarball = (String) ((LinkedHashMap)(versions.get(key).get("dist"))).get("tarball");
        logger.info("tarball="+ tarball);
        AllVersionsDetails allVersionsDetails = new AllVersionsDetails();
        MinifiedJS js = ZipModule.readZipFileFromRemote(tarball, name);
        double minfiedSize = js.getMinfied().getBytes(StandardCharsets.UTF_8).length;
        minfiedSize=Math.ceil(minfiedSize/1024.00);

        double moduleSize = Math.ceil(js.getModuleSize()/1024);

        double minfiedGzippedSize = GZIPCompression.compress(js.getMinfied()).length;
        minfiedGzippedSize = minfiedGzippedSize / 1024.00;

        allVersionsDetails.setMinifiedSize(String.valueOf(minfiedSize));
        allVersionsDetails.setModuleSize(String.valueOf(moduleSize));
        allVersionsDetails.setMinifiedGzippedSize(String.valueOf(String.format("%.2f", minfiedGzippedSize)));
        allVersionsDetails.setVersion(key);
        allVersionsDetails.setName(name);
        return allVersionsDetails;
    }


    private String getPreviousMajorRelease(Object[] objects, String lastRelease)
    {
        int current = Integer.parseInt(lastRelease.split("[.]")[0]);
        String previousRelease = null;
        int prev = current-1;
        String previousVersion = null;
        String tempVersion = null;
        for(int i=objects.length-4;i>0;i--)
        {
            tempVersion = (String)objects[i];
            if(tempVersion.contains("-"))
            {
                continue;
            }
            previousRelease = ((String)objects[i]).split("[.]")[0];
            if((current- Integer.parseInt(previousRelease) > 1))
            {
                if(tempVersion.startsWith(previousRelease))
                {
                    previousVersion = tempVersion;
                    break;
                }
            }
        }
        return previousVersion;
    }
}
