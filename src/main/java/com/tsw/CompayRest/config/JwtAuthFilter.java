package com.tsw.CompayRest.config;

import com.tsw.CompayRest.Dto.UserDto;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final UserAuthenticationProvider userAuthenticationProvider;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        String requestURI = request.getRequestURI();
        if (requestURI.equals("/login") || requestURI.equals("/register")) {
            filterChain.doFilter(request, response);
            return;
        }

        if (header != null) {
            String[] authElements = header.split(" ");

            if (authElements.length == 2 && "Bearer".equals(authElements[0])) {
                try {
                    Authentication authentication;
                    if ("GET".equals(request.getMethod())) {
                        authentication = userAuthenticationProvider.validateToken(authElements[1]);
                    } else {
                        authentication = userAuthenticationProvider.validateTokenStrongly(authElements[1]);
                    }

                    // Obtener el usuario autenticado
                    UserDto user = (UserDto) authentication.getPrincipal();

                    // Almacenar el userId en el request
                    request.setAttribute("userId", user.getId());

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } catch (RuntimeException e) {
                    SecurityContextHolder.clearContext();
                    throw e;
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
