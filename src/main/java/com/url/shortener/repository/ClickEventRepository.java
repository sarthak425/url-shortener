package com.url.shortener.repository;

import com.url.shortener.model.ClickEvent;
import com.url.shortener.model.UrlMapping;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClickEventRepository extends JpaRepository<ClickEvent, Long> {
    List<ClickEvent> findByUrlMapping(UrlMapping urlMapping);
}
