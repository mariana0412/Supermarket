package com.supermarket.security.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
                .requestMatchers("/api/auth/**").permitAll()

                // add category, product, store product and employee can only manager
                .requestMatchers(HttpMethod.POST,
                        "/api/categories",
                        "/api/products",
                        "/api/store-products",
                        "/api/employees")
                .hasRole("MANAGER")

                // add check and sale can only cashier
                .requestMatchers(HttpMethod.POST,
                        "/api/checks",
                        "/api/sales")
                .hasRole("CASHIER")

                // add customer card can both manager and cashier
                .requestMatchers(HttpMethod.POST, "/api/customer-cards").authenticated()

                // edit category, product, store product and employee can only manager
                .requestMatchers(HttpMethod.PUT,
                        "/api/categories/**",
                        "/api/products/**",
                        "/api/store-products/**",
                        "/api/employees/**")
                .hasRole("MANAGER")

                // edit customer card can both manager and cashier
                .requestMatchers(HttpMethod.PUT, "/api/customer-cards/**").authenticated()

                // delete everything can only manager
                .requestMatchers(HttpMethod.DELETE,
                        "/api/categories/**",
                        "/api/products/**",
                        "/api/store-products/**",
                        "/api/employees/**",
                        "/api/customer-cards/**",
                        "/api/checks/**")
                .hasRole("MANAGER")

                // get all or get by id can both manager and cashier
                .requestMatchers(HttpMethod.GET,
                        "/api/categories", "/api/categories/**",
                        "/api/products",  "/api/products/**",
                        "/api/store-products", "/api/store-products/**",
                        "/api/employees", "/api/employees/**",
                        "/api/customer-cards", "/api/customer-cards/**",
                        "/api/checks", "/api/checks/**",
                        "/api/sales")
                .authenticated()

                // determine the total number of a certain product sold for a certain time can only manager
                .requestMatchers(HttpMethod.GET, "/api/products-number/**").hasRole("MANAGER")

                // get store product details by UPC can both manager and cashier
                .requestMatchers(HttpMethod.GET, "/api/store-products-details/**").authenticated()

                // determine the total sum from range of checks can only manager
                .requestMatchers(HttpMethod.GET, "/api/checks-sum").hasRole("MANAGER")

                // get employee's contact info by surname can only manager
                .requestMatchers(HttpMethod.GET, "/api/employees/contact-info").hasRole("MANAGER")

                .anyRequest().authenticated()

                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
