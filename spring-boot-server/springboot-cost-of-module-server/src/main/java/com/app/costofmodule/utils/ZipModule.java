package com.app.costofmodule.utils;

import com.app.costofmodule.model.MinifiedJS;
import com.app.costofmodule.service.impl.PostServiceImpl;
import org.apache.commons.compress.archivers.tar.TarArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveInputStream;
import org.apache.commons.compress.utils.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.zip.GZIPInputStream;

public class ZipModule {

    public final static MinifiedJS readZipFileFromRemote(String remoteFileUrl, String moduleName) {
        Logger logger = LoggerFactory.getLogger(PostServiceImpl.class);

        MinifiedJS minifiedJS = new MinifiedJS();
        StringBuilder builder = new StringBuilder();
        GZIPInputStream in = null;
        TarArchiveInputStream  tis = null;
        try {
            URL url = new URL(remoteFileUrl);
            in = new GZIPInputStream(url.openStream(), 1024);
            tis = new TarArchiveInputStream(in);
            TarArchiveEntry tarEntry = null;
            String code = null;
            while ((tarEntry = tis.getNextTarEntry()) != null) {
                logger.debug(" tar entry- " + tarEntry.getName());
                StringWriter writer = new StringWriter();
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                IOUtils.copy(tis, outputStream);
                byte [] bytes = outputStream.toByteArray();
                code = new String(bytes);
                if (!minifiedJS.isAlreadyMinified() && tarEntry.getName().contains(moduleName+".") && tarEntry.getName().endsWith(".min.js")) {
                    minifiedJS.setMinfied(code);
                    minifiedJS.setModuleSize(bytes.length);
                    minifiedJS.setAlreadyMinified(true);
                    tis.close();
                    in.close();
                    outputStream.close();
                    return minifiedJS;
                }
                try {
                    if (tarEntry.getName().endsWith(".js") || tarEntry.getName().endsWith(".css")) {
                        String uglifiedCode = UglifyMinify.compile(code, tarEntry.getName());
                        builder.append(uglifiedCode);
                        minifiedJS.setModuleSize(minifiedJS.getModuleSize() + uglifiedCode.getBytes(StandardCharsets.UTF_8).length);
                    }
                }catch(Exception ex)
                {
                    logger.error("Error wihle processing file "+ tarEntry.getName(), ex);
                }
                outputStream.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        finally {
            try {
                tis.close();
                in.close();
            } catch (IOException e) {
                e.printStackTrace();
            }

        }

        minifiedJS.setMinfied(builder.toString());
        return minifiedJS;
    }
}
