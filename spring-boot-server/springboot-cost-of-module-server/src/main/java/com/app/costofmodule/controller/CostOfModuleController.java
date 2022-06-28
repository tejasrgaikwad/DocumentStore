package com.app.costofmodule.controller;

import com.app.costofmodule.exception.InvalidRequestException;
import com.app.costofmodule.model.AllVersionsDetails;
import com.app.costofmodule.model.PackageMetadata;
import com.app.costofmodule.model.Post;
import com.app.costofmodule.service.PostService;
import com.app.costofmodule.utils.ValidationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${server.baseUrl}")
public class CostOfModuleController {

	@Autowired
	PostService service;

	@CrossOrigin("http://localhost:3000")
	@RequestMapping(method = RequestMethod.GET, value = "/", produces = "application/json")
	public ResponseEntity<?> getAllPosts(@RequestParam String name) {
		try {
			ValidationUtils.validateString(name);
		} catch (InvalidRequestException e) {
			return new ResponseEntity<>("Invalid Request :"+ e.getLocalizedMessage(), HttpStatus.BAD_REQUEST);
		}

		Object[] list = service.getPackageSuggestions(name);
		return new ResponseEntity<>(list, list==null? HttpStatus.NO_CONTENT: HttpStatus.OK);
	}

	@CrossOrigin("http://localhost:3000")
	@RequestMapping(method = RequestMethod.GET, value = "/package-details", produces = "application/json")
	public ResponseEntity<?> getPackageDetails(@RequestParam String name) {
		try {
			ValidationUtils.validateString(name);
		} catch (InvalidRequestException e) {
			return new ResponseEntity<>("Invalid Request :"+ e.getLocalizedMessage(), HttpStatus.BAD_REQUEST);
		}

		AllVersionsDetails[] list = service.getPackageMetadata(name);
		return new ResponseEntity<>(list, list==null? HttpStatus.NO_CONTENT: HttpStatus.OK);
	}
}
