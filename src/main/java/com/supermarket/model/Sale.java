package com.supermarket.model;

import lombok.Getter;
import lombok.Setter;

public class Sale {
    @Getter @Setter
    private String UPC;
    @Getter @Setter
    private String check_number;
    @Getter @Setter
    private int product_number;
    @Getter @Setter
    private double selling_price;

    public Sale(String UPC, String check_number, int product_number, double selling_price) {
        this.UPC = UPC;
        this.check_number = check_number;
        this.product_number = product_number;
        this.selling_price = selling_price;
    }

    public Sale(String check_number, int product_number, double selling_price) {
        this.check_number = check_number;
        this.product_number = product_number;
        this.selling_price = selling_price;
    }

    public Sale() {}

    @Override
    public String toString() {
        return "Sale{" +
                "UPC='" + UPC + '\'' +
                ", check_number='" + check_number + '\'' +
                ", product_number=" + product_number +
                ", selling_price=" + selling_price +
                '}';
    }

    public static class ProductNameNumberPrice {
        @Getter @Setter
        private String product_name;
        @Getter @Setter
        private int product_number;
        @Getter @Setter
        private double selling_price;

        public ProductNameNumberPrice(String product_name, int product_number, double selling_price) {
            this.product_name = product_name;
            this.product_number = product_number;
            this.selling_price = selling_price;
        }

        ProductNameNumberPrice() {}
    }

}
