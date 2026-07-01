package com.url.shortener.service;

import com.url.shortener.model.UrlMapping;
import com.url.shortener.model.User;
import com.url.shortener.repository.UrlMappingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UrlService {

    @Autowired
    private UrlMappingRepository urlMappingRepository;

    public UrlMapping shortenUrl(String originalUrl, String customAlias, User user) {
        String shortUrl;
        if (customAlias != null && !customAlias.trim().isEmpty()) {
            String alias = customAlias.trim();
            // Strip leading/trailing slashes
            while (alias.startsWith("/")) alias = alias.substring(1);
            while (alias.endsWith("/")) alias = alias.substring(0, alias.length() - 1);
            
            if (!alias.matches("^[a-zA-Z0-9-_/]+$")) {
                throw new IllegalArgumentException("Custom alias contains invalid characters. Only alphanumeric, hyphens, underscores, and slashes are allowed.");
            }
            if (urlMappingRepository.findByShortURL(alias).isPresent()) {
                throw new IllegalArgumentException("Custom alias is already taken.");
            }
            shortUrl = alias;
        } else {
            shortUrl = generateShortUrl();
        }

        UrlMapping urlMapping = new UrlMapping();
        urlMapping.setOriginalUrl(originalUrl);
        urlMapping.setShortURL(shortUrl);
        urlMapping.setUser(user);
        urlMapping.setCreatedData(LocalDateTime.now());
        urlMapping.setClickCount(0);
        return urlMappingRepository.save(urlMapping);
    }

    public UrlMapping updateUrlMapping(Long id, String newOriginalUrl, String newCustomAlias, User user) {
        UrlMapping urlMapping = urlMappingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("URL mapping not found"));

        if (urlMapping.getUser().getId() != user.getId()) {
            throw new SecurityException("Unauthorized access to this URL mapping");
        }

        if (newOriginalUrl == null || newOriginalUrl.trim().isEmpty()) {
            throw new IllegalArgumentException("Original URL is required");
        }

        urlMapping.setOriginalUrl(newOriginalUrl.trim());

        if (newCustomAlias != null && !newCustomAlias.trim().isEmpty()) {
            String alias = newCustomAlias.trim();
            // Strip leading/trailing slashes
            while (alias.startsWith("/")) alias = alias.substring(1);
            while (alias.endsWith("/")) alias = alias.substring(0, alias.length() - 1);

            if (!alias.equals(urlMapping.getShortURL())) {
                if (!alias.matches("^[a-zA-Z0-9-_/]+$")) {
                    throw new IllegalArgumentException("Custom alias contains invalid characters. Only alphanumeric, hyphens, underscores, and slashes are allowed.");
                }
                if (urlMappingRepository.findByShortURL(alias).isPresent()) {
                    throw new IllegalArgumentException("Custom alias is already taken");
                }
                urlMapping.setShortURL(alias);
            }
        }

        return urlMappingRepository.save(urlMapping);
    }

    public void deleteUrlMapping(Long id, User user) {
        UrlMapping urlMapping = urlMappingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("URL mapping not found"));

        if (urlMapping.getUser().getId() != user.getId()) {
            throw new SecurityException("Unauthorized access to this URL mapping");
        }

        urlMappingRepository.delete(urlMapping);
    }

    public Map<String, Long> getClickAnalytics(Long id, User user) {
        UrlMapping urlMapping = urlMappingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("URL mapping not found"));

        if (urlMapping.getUser().getId() != user.getId()) {
            throw new SecurityException("Unauthorized access to this URL mapping");
        }

        return urlMapping.getClickEvents().stream()
                .collect(Collectors.groupingBy(
                        click -> click.getClickData().toLocalDate().toString(),
                        Collectors.counting()
                ));
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
