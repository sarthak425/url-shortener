package com.url.shortener.controller;

import com.url.shortener.dto.UrlMappingDto;
import com.url.shortener.model.UrlMapping;
import com.url.shortener.model.User;
import com.url.shortener.service.UrlService;
import com.url.shortener.service.UserDetailsImpl;
import com.url.shortener.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/urls")
public class UrlController {

    @Autowired
    private UrlService urlService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/shorten")
    public ResponseEntity<?> shortenUrl(@RequestBody Map<String, String> request) {
        String originalUrl = request.get("originalUrl");
        if (originalUrl == null || originalUrl.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Original URL is required");
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("Error: User not found");
        }

        UrlMapping urlMapping = urlService.shortenUrl(originalUrl, user);
        return ResponseEntity.ok(convertToDto(urlMapping));
    }

    @GetMapping
    public ResponseEntity<List<UrlMappingDto>> getUserUrls() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().build();
        }

        List<UrlMapping> urls = urlService.getUrlsByUser(user);
        List<UrlMappingDto> dtos = urls.stream().map(this::convertToDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    private UrlMappingDto convertToDto(UrlMapping urlMapping) {
        UrlMappingDto dto = new UrlMappingDto();
        dto.setId(urlMapping.getId());
        dto.setOriginalUrl(urlMapping.getOriginalUrl());
        dto.setShortUrl(urlMapping.getShortURL());
        dto.setClickCount(urlMapping.getClickCount());
        dto.setCreatedDate(urlMapping.getCreatedData());
        dto.setUsername(urlMapping.getUser().getUsername());
        return dto;
    }
}
