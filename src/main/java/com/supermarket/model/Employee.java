package com.supermarket.model;

import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.util.UUID;

public class Employee {
    @Getter @Setter
    private String id_employee;
    @Getter @Setter
    private String empl_surname;
    @Getter @Setter
    private String empl_name;
    @Getter @Setter
    private String empl_patronymic;
    @Getter @Setter
    private String empl_role;
    @Getter @Setter
    private double salary;
    @Getter @Setter
    private Date date_of_birth;
    @Getter @Setter
    private Date date_of_start;
    @Getter @Setter
    private String phone_number;
    @Getter @Setter
    private String city;
    @Getter @Setter
    private String street;
    @Getter @Setter
    private String zip_code;

    public Employee(String id_employee, String empl_surname, String empl_name, String empl_patronymic, String empl_role, double salary, Date date_of_birth, Date date_of_start, String phone_number, String city, String street, String zip_code) {
        this.id_employee = id_employee;
        this.empl_surname = empl_surname;
        this.empl_name = empl_name;
        this.empl_patronymic = empl_patronymic;
        this.empl_role = empl_role;
        this.salary = salary;
        this.date_of_birth = date_of_birth;
        this.date_of_start = date_of_start;
        this.phone_number = phone_number;
        this.city = city;
        this.street = street;
        this.zip_code = zip_code;
    }

    public Employee(String empl_surname, String empl_name, String empl_patronymic, String empl_role, double salary, Date date_of_birth, Date date_of_start, String phone_number, String city, String street, String zip_code) {
        UUID uuid = UUID.randomUUID();
        this.id_employee = uuid.toString().substring(0, 10);
        this.empl_surname = empl_surname;
        this.empl_name = empl_name;
        this.empl_patronymic = empl_patronymic;
        this.empl_role = empl_role;
        this.salary = salary;
        this.date_of_birth = date_of_birth;
        this.date_of_start = date_of_start;
        this.phone_number = phone_number;
        this.city = city;
        this.street = street;
        this.zip_code = zip_code;
    }

    public Employee() {}

    @Override
    public String toString() {
        return "Emloyee{" +
                "id_employee='" + id_employee + '\'' +
                ", empl_surname='" + empl_surname + '\'' +
                ", empl_name='" + empl_name + '\'' +
                ", empl_patronymic='" + empl_patronymic + '\'' +
                ", empl_role='" + empl_role + '\'' +
                ", salary=" + salary +
                ", date_of_birth=" + date_of_birth +
                ", date_of_start=" + date_of_start +
                ", phone_number='" + phone_number + '\'' +
                ", city='" + city + '\'' +
                ", street='" + street + '\'' +
                ", zip_code='" + zip_code + '\'' +
                '}';
    }

    public static class EmployeeContactInfo {
        @Getter @Setter
        private String phone_number;
        @Getter @Setter
        private String city;
        @Getter @Setter
        private String street;
        @Getter @Setter
        private String zip_code;

        public EmployeeContactInfo(String phone_number, String city, String street, String zip_code) {
            this.phone_number = phone_number;
            this.city = city;
            this.street = street;
            this.zip_code = zip_code;
        }

        EmployeeContactInfo() {}
    }

}
