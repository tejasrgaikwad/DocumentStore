package com.app.costofmodule.model;

public class Post {
    private String email;
    private String message;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public boolean equals(Object o)
    {
        if(o!=null && o instanceof  Post)
        {
            Post p = (Post) o;
            if(p.getEmail() !=null && p.getMessage() !=null && p.getEmail().equals(email) && p.getMessage().equals(message))
                return true;
            return false;

        }
        return false;
    }
}
