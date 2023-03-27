package com.supermarket.model;

public class Product {
    private int id_product;
    private int category_number;
    private String product_name;
    private String producer;
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

    public int getId_product() {
        return id_product;
    }

    public void setId_product(int id_product) {
        this.id_product = id_product;
    }

    public int getCategory_number() {
        return category_number;
    }

    public void setCategory_number(int category_number) {
        this.category_number = category_number;
    }

    public String getProduct_name() {
        return product_name;
    }

    public void setProduct_name(String product_name) {
        this.product_name = product_name;
    }

    public String getProducer() {
        return producer;
    }

    public void setProducer(String producer) {
        this.producer = producer;
    }

    public String getCharacteristics() {
        return characteristics;
    }

    public void setCharacteristics(String characteristics) {
        this.characteristics = characteristics;
    }
}
