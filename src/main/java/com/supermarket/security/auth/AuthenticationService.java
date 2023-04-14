package com.supermarket.security.auth;

import com.supermarket.security.config.JwtService;
import com.supermarket.security.user.Role;
import com.supermarket.security.user.User;
import com.supermarket.security.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .phone_number(request.getPhone_number())
                .user_password(passwordEncoder.encode(request.getUser_password()))
                .role(Role.USER)
                .build();
        System.out.println("USER: " + user);
        repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        System.out.println(request.getPhone_number());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getPhone_number(),
                        request.getUser_password()
                )
        );
        var user = repository.findByPhoneNumber(request.getPhone_number())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}
