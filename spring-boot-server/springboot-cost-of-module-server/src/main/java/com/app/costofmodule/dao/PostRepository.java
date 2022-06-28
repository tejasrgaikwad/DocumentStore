package com.app.costofmodule.dao;

import com.app.costofmodule.model.Post;
import org.springframework.stereotype.Repository;
import org.springframework.web.context.ServletContextAware;

import javax.servlet.ServletContext;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class PostRepository implements ServletContextAware {

    ServletContext context;


    public Post savePost(Post post) throws Exception
    {
        if(context !=null)
        {
            Map<String, Post> data = (Map<String, Post>) context.getAttribute("data");
            if(data == null)
            {
                data = new HashMap<>();
                data.put(post.getEmail(), post);
                context.setAttribute("data", data);
                return post;
            }
            if(data.get(post.getEmail()) !=null)
            {
                throw new Exception("EmailID already exists....");
            }
            data.put(post.getEmail(), post);
        }
        return post;
    }

    @Override
    public void setServletContext(ServletContext servletContext)
    {
        this.context = servletContext;
    }

    public List<Post> getPosts()
    {
        Map<String, Post> posts = (Map<String, Post>) context.getAttribute("data");
        if(posts==null)
        {
            return null;
        }
        return new ArrayList<>(posts.values());
    }

    public Post deletePost(Post post) {

        Map<String, Post> posts = (Map<String, Post>) context.getAttribute("data");
        if(posts.containsKey(post.getEmail()))
        {
            posts.remove(post.getEmail());
        }
        context.setAttribute("data", posts);
        return post;
    }
}
