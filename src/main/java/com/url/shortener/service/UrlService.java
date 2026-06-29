package com.url.shortener.service;

import com.url.shortener.model.UrlMapping;
import com.url.shortener.model.User;
import com.url.shortener.repository.UrlMappingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UrlService {

    @Autowired
    private UrlMappingRepository urlMappingRepository;

    public UrlMapping shortenUrl(String originalUrl, User user) {
        String shortUrl = generateShortUrl();
        UrlMapping urlMapping = new UrlMapping();
        urlMapping.setOriginalUrl(originalUrl);
        urlMapping.setShortURL(shortUrl);
        urlMapping.setUser(user);
        urlMapping.setCreatedData(LocalDateTime.now());
        urlMapping.setClickCount(0);
        return urlMappingRepository.save(urlMapping);
    }

    public Optional<UrlMapping> getOriginalUrl(String shortUrl) {
        return urlMappingRepository.findByShortURL(shortUrl);
    }

    public List<UrlMapping> getUrlsByUser(User user) {
        return urlMappingRepository.findByUser(user);
    }

    private String generateShortUrl() {
        return UUID.randomUUID().toString().substring(0, 8);
    }
}
