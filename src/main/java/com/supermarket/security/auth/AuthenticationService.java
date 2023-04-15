package com.supermarket.security.auth;

import com.supermarket.model.Employee;
import com.supermarket.security.config.JwtService;
import com.supermarket.security.user.UserRole;
import com.supermarket.security.user.User;
import com.supermarket.security.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    public AuthenticationResponse register(AuthenticationRequest request) {
        String phoneNumber = request.getPhone_number();
        Employee employee = userRepository.findEmployeeByPhoneNumber(phoneNumber);
        if(employee == null)
            return (AuthenticationResponse) ResponseEntity.notFound();

        UserRole newUserRole;
        String employeeRoleForComparison = employee.getEmpl_role();
        String enumRoleForComparison = UserRole.MANAGER.toString();

        if(employeeRoleForComparison.compareToIgnoreCase(enumRoleForComparison) == 0)
            newUserRole = UserRole.MANAGER;
        else
            newUserRole = UserRole.CASHIER;

        var user = User.builder()
                .phone_number(request.getPhone_number())
                .user_password(passwordEncoder.encode(request.getUser_password()))
                .role(newUserRole)
                .build();
        userRepository.save(user);
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
        var user = userRepository.findByPhoneNumber(request.getPhone_number());
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}
