package com.supermarket.model;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

public class CustomerCard {
    @Getter @Setter
    private String card_number;
    @Getter @Setter
    private String cust_surname;
    @Getter @Setter
    private String cust_name;
    @Getter @Setter
    private String cust_patronymic;
    @Getter @Setter
    private String phone_number;
    @Getter @Setter
    private String city;
    @Getter @Setter
    private String street;
    @Getter @Setter
    private String zip_code;
    @Getter @Setter
    private int percent;

    public CustomerCard(String card_number, String cust_surname, String cust_name, String cust_patronymic, String phone_number, String city, String street, String zip_code, int percent) {
        this.card_number = card_number;
        this.cust_surname = cust_surname;
        this.cust_name = cust_name;
        this.cust_patronymic = cust_patronymic;
        this.phone_number = phone_number;
        this.city = city;
        this.street = street;
        this.zip_code = zip_code;
        this.percent = percent;
    }

    public CustomerCard(String cust_surname, String cust_name, String cust_patronymic, String phone_number, String city, String street, String zip_code, int percent) {
        UUID uuid = UUID.randomUUID();
        this.card_number = uuid.toString().substring(0, 10);
        this.cust_surname = cust_surname;
        this.cust_name = cust_name;
        this.cust_patronymic = cust_patronymic;
        this.phone_number = phone_number;
        this.city = city;
        this.street = street;
        this.zip_code = zip_code;
        this.percent = percent;
    }

    public CustomerCard() {}

    @Override
    public String toString() {
        return "CustomerCard{" +
                "card_number='" + card_number + '\'' +
                ", cust_surname='" + cust_surname + '\'' +
                ", cust_name='" + cust_name + '\'' +
                ", cust_patronymic='" + cust_patronymic + '\'' +
                ", phone_number='" + phone_number + '\'' +
                ", city='" + city + '\'' +
                ", street='" + street + '\'' +
                ", zip_code='" + zip_code + '\'' +
                ", percent=" + percent +
                '}';
    }

}
