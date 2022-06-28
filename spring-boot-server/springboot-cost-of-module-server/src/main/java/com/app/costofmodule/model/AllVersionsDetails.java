package com.app.costofmodule.model;

public class AllVersionsDetails {
    private String moduleSize;
    private String minifiedSize;
    private String minifiedGzippedSize;
    private String version;
    private String name;

    public String getModuleSize() {
        return moduleSize;
    }

    public void setModuleSize(String moduleSize) {
        this.moduleSize = moduleSize;
    }

    public String getMinifiedSize() {
        return minifiedSize;
    }

    public void setMinifiedSize(String minifiedSize) {
        this.minifiedSize = minifiedSize;
    }

    public String getMinifiedGzippedSize() {
        return minifiedGzippedSize;
    }

    public void setMinifiedGzippedSize(String minifiedGzippedSize) {
        this.minifiedGzippedSize = minifiedGzippedSize;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    @Override
    public String toString() {
        return "AllVersionsDetails{" +
                "moduleSize='" + moduleSize + '\'' +
                ", minifiedSize='" + minifiedSize + '\'' +
                ", minifiedGzippedSize='" + minifiedGzippedSize + '\'' +
                ", version='" + version + '\'' +
                ", name='" + name + '\'' +
                '}';
    }
}
