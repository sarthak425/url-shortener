package com.url.shortener.repository;

import com.url.shortener.model.UrlMapping;
import com.url.shortener.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UrlMappingRepository extends JpaRepository<UrlMapping, Long> {
    Optional<UrlMapping> findByShortURL(String shortUrl);
    List<UrlMapping> findByUser(User user);
}
