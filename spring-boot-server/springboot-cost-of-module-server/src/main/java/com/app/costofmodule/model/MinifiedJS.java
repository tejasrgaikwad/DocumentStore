package com.app.costofmodule.model;

public class MinifiedJS {
    private String minfied;
    private boolean alreadyMinified;
    private long moduleSize;

    public String getMinfied() {
        return minfied;
    }

    public void setMinfied(String minfied) {
        this.minfied = minfied;
    }

    public boolean isAlreadyMinified() {
        return alreadyMinified;
    }

    public void setAlreadyMinified(boolean alreadyMinified) {
        this.alreadyMinified = alreadyMinified;
    }

    public long getModuleSize() {
        return moduleSize;
    }

    public void setModuleSize(long moduleSize) {
        this.moduleSize = moduleSize;
    }
}
