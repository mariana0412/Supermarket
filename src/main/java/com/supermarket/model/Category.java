package com.supermarket.model;

import lombok.Getter;
import lombok.Setter;

public class Category {
    @Getter
    @Setter
    private int category_number;
    @Getter
    @Setter
    private String category_name;

    public Category(int category_number, String category_name) {
        this.category_number = category_number;
        this.category_name = category_name;
    }

    public Category(String category_name) {
        this.category_name = category_name;
    }

    public Category() {}

    @Override
    public String toString() {
        return "Category{" +
                "category_number=" + category_number +
                ", category_name='" + category_name + '\'' +
                '}';
    }

}
