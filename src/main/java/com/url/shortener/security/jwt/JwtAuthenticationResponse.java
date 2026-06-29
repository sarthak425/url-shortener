package com.url.shortener.security.jwt;

import lombok.Data;

import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@Builder
@AllArgsConstructor
public class JwtAuthenticationResponse {
    private String  token;

}
