package com.supermarket.model;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

public class Check {

    @Getter @Setter
    private String check_number;
    @Getter @Setter
    private String id_employee;
    @Getter @Setter
    private String card_number;
    @Getter @Setter
    private LocalDateTime print_date;
    @Getter @Setter
    private double sum_total;
    @Getter @Setter
    private double vat;

    public Check(String check_number, String id_employee, String card_number, LocalDateTime print_date, double sum_total, double vat) {
        this.check_number = check_number;
        this.id_employee = id_employee;
        this.card_number = card_number;
        this.print_date = print_date;
        this.sum_total = sum_total;
        this.vat = vat;
    }

    public Check(String id_employee, String card_number, LocalDateTime print_date, double sum_total, double vat) {
        this.id_employee = id_employee;
        this.card_number = card_number;
        this.print_date = print_date;
        this.sum_total = sum_total;
        this.vat = vat;
    }

    public Check() {}

    @Override
    public String toString() {
        return "Check{" +
                "check_number='" + check_number + '\'' +
                ", id_employee='" + id_employee + '\'' +
                ", card_number='" + card_number + '\'' +
                ", print_date=" + print_date +
                ", sum_total=" + sum_total +
                ", vat=" + vat +
                '}';
    }

}
