package com.supermarket.model;

import lombok.Getter;
import lombok.Setter;

public class StoreProduct {
    @Getter @Setter
    private String UPC;
    @Getter @Setter
    private String UPC_prom;
    @Getter @Setter
    private int id_product;
    @Getter @Setter
    private double selling_price;
    @Getter @Setter
    private int products_number;
    @Getter @Setter
    private boolean promotional_product;

    public StoreProduct(String UPC, String UPC_prom, int id_product, double selling_price, int products_number, boolean promotional_product) {
        this.UPC = UPC;
        this.UPC_prom = UPC_prom;
        this.id_product = id_product;
        this.selling_price = selling_price;
        this.products_number = products_number;
        this.promotional_product = promotional_product;
    }

    public StoreProduct(String UPC, int id_product, double selling_price, int products_number, boolean promotional_product) {
        this.UPC = UPC;
        this.id_product = id_product;
        this.selling_price = selling_price;
        this.products_number = products_number;
        this.promotional_product = promotional_product;
    }

    public StoreProduct(int id_product, double selling_price, int products_number, boolean promotional_product) {
        this.id_product = id_product;
        this.selling_price = selling_price;
        this.products_number = products_number;
        this.promotional_product = promotional_product;
    }

    public StoreProduct() {}

    @Override
    public String toString() {
        return "StoreProduct{" +
                "UPC='" + UPC + '\'' +
                ", UPC_prom='" + UPC_prom + '\'' +
                ", id_product=" + id_product +
                ", selling_price=" + selling_price +
                ", products_number=" + products_number +
                ", promotional_product=" + promotional_product +
                '}';
    }

    public static class StoreProductDetails {
        @Getter @Setter
        private String UPC;
        @Getter @Setter
        private double selling_price;
        @Getter @Setter
        private int products_number;
        @Getter @Setter
        private String product_name;
        @Getter @Setter
        private String characteristics;

        public StoreProductDetails(String UPC, double selling_price, int products_number, String product_name, String characteristics) {
            this.UPC = UPC;
            this.selling_price = selling_price;
            this.products_number = products_number;
            this.product_name = product_name;
            this.characteristics = characteristics;
        }

        public StoreProductDetails(double selling_price, int products_number, String product_name, String characteristics) {
            this.selling_price = selling_price;
            this.products_number = products_number;
            this.product_name = product_name;
            this.characteristics = characteristics;
        }

        StoreProductDetails() {}

        public String getUPC() {
            return UPC;
        }

        public void setUPC(String UPC) {
            this.UPC = UPC;
        }

        public double getSelling_price() {
            return selling_price;
        }

        public void setSelling_price(double selling_price) {
            this.selling_price = selling_price;
        }

        public int getProducts_number() {
            return products_number;
        }

        public void setProducts_number(int products_number) {
            this.products_number = products_number;
        }

        public String getProduct_name() {
            return product_name;
        }

        public void setProduct_name(String product_name) {
            this.product_name = product_name;
        }

        public String getCharacteristics() {
            return characteristics;
        }

        public void setCharacteristics(String characteristics) {
            this.characteristics = characteristics;
        }
    }

}
