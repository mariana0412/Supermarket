package com.supermarket.model;

import lombok.Getter;
import lombok.Setter;

public class Product {
    @Getter @Setter
    private int id_product;
    @Getter @Setter
    private int category_number;
    @Getter @Setter
    private String product_name;
    @Getter @Setter
    private String producer;
    @Getter @Setter
    private String characteristics;

    public Product(int id_product, int category_number, String product_name, String producer, String characteristics) {
        this.id_product = id_product;
        this.category_number = category_number;
        this.product_name = product_name;
        this.producer = producer;
        this.characteristics = characteristics;
    }

    public Product(int category_number, String product_name, String producer, String characteristics) {
        this.category_number = category_number;
        this.product_name = product_name;
        this.producer = producer;
        this.characteristics = characteristics;
    }

    public Product() {}

    @Override
    public String toString() {
        return "Product{" +
                "id_product=" + id_product +
                ", category_number=" + category_number +
                ", product_name='" + product_name + '\'' +
                ", producer='" + producer + '\'' +
                ", characteristics='" + characteristics + '\'' +
                '}';
    }

}
