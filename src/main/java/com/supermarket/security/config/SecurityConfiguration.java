package com.supermarket.security.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf()
                .disable()
                .authorizeHttpRequests()
                .anyRequest().permitAll() // TODO: finish permits on frontend
                /*.requestMatchers("/api/auth/**").permitAll()

                .requestMatchers(HttpMethod.POST,
                        "/api/categories",
                        "/api/products",
                        "/api/store-products",
                        "/api/employees",
                        "/api/customer-cards")
                .hasRole("MANAGER")

                .requestMatchers(HttpMethod.POST, "/api/checks").hasRole("CASHIER")

                .requestMatchers(HttpMethod.PUT,
                        "/api/categories/**",
                        "/api/products/**",
                        "/api/store-products/**",
                        "/api/employees/**")
                .hasRole("MANAGER")

                .requestMatchers(HttpMethod.DELETE,
                        "/api/categories/**",
                        "/api/products/**",
                        "/api/store-products/**",
                        "/api/employees/**",
                        "/api/customer-cards/**",
                        "/api/checks/**")
                .hasRole("MANAGER")

*/


                //.anyRequest().authenticated()
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
