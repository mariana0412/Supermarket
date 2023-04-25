package com.supermarket.model;

import lombok.Getter;
import lombok.Setter;

public class TotalSumPerCashier {
    @Getter @Setter
    private String id_employee;
    @Getter @Setter
    private String empl_surname;
    @Getter @Setter
    private String empl_name;
    @Getter @Setter
    private String empl_patronymic;
    @Getter @Setter
    private double total_sum;

    public TotalSumPerCashier(String id_employee, String empl_surname, String empl_name, String empl_patronymic, double total_sum) {
        this.id_employee = id_employee;
        this.empl_surname = empl_surname;
        this.empl_name = empl_name;
        this.empl_patronymic = empl_patronymic;
        this.total_sum = total_sum;
    }

    public TotalSumPerCashier(){}

}
