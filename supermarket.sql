--
-- Database: `supermarket`
--

--
-- Table structure for table `employee`
--
CREATE TABLE employee
(
    id_emloyee VARCHAR(10) PRIMARY KEY NOT NULL,
    empl_surname VARCHAR(50) NOT NULL,
    empl_name VARCHAR(50) NOT NULL,
    empl_patronymic VARCHAR(50) NULL,
    empl_role VARCHAR(10) NOT NULL,
    salary DECIMAL(13,4) NOT NULL,
    date_of_birth DATE NOT NULL,
    date_of_start DATE NOT NULL,
    phone_number VARCHAR(13) NOT NULL,
    city VARCHAR(50) NOT NULL,
    street VARCHAR(50) NOT NULL,
    zip_code VARCHAR(9) NOT NULL
);


--
-- Dumping data for table `category`
--
INSERT INTO employee (id_employee, empl_surname, empl_name, empl_patronymic, empl_role, salary, date_of_birth, date_of_start, phone_number, city, street, zip_code) VALUES
('d1jc79slc6', 'Kozak', 'Ivan', 'Ihorovych', 'Cashier', '7000', '1990-04-05', '2022-05-05', '+380975632345', 'Lviv', 'Botanichna', '79007'),
('ksl39fcbq0', 'Ivanyshyn', 'Maria', 'Petrivna', 'Manager', '8000', '1996-08-10', '2021-06-02', '+380985068635', 'Lviv', 'Brativ Rohatyntsiv', '79068'),
('sl3hc720ad', 'Perenko', 'Ilona', 'Viktorivna', 'Cashier', '7000', '1983-01-09', '2018-04-08', '+380977856321', 'Lviv', 'Buzkova', '79007'),
('hdt36r9x2k', 'Kolos', 'Ihor', 'Dmytrovych', 'Cashier', '7000', '1998-03-03', '2023-02-02', '+380997562341', 'Lviv', 'Kulparkivska', '79068'),
('f3k77dls92', 'Bondar', 'Arsen', 'Petrovych', 'Cashier', '7000', '1985-02-10', '2019-06-08', '+380975782246', 'Lviv', 'Zelena', '79007');


-- --------------------------------------------------------

--
-- Table structure for table `customer_card`
--
CREATE TABLE customer_card
(
    card_number VARCHAR(13) PRIMARY KEY NOT NULL,
    cust_surname VARCHAR(50) NOT NULL,
    cust_name VARCHAR(50) NOT NULL,
    cust_patronymic VARCHAR(50) NULL,
    phone_number VARCHAR(13) NOT NULL,
    city VARCHAR(50) NULL,
    street VARCHAR(50) NULL,
    zip_code VARCHAR(9) NULL,
    percent SMALLINT NOT NULL
);

--
-- Dumping data for table `customer_card`
--
INSERT INTO customer_card (card_number, cust_surname, cust_name, cust_patronymic, phone_number, city,  street, zip_code, percent) VALUES
    ('hg79dk2n47', 'Bratkov', 'Ivan', '', '+380975632345', '', '', '', 20);


-- --------------------------------------------------------

--
-- Table structure for table `category`
--
CREATE TABLE category
(
    category_number INTEGER PRIMARY KEY NOT NULL,
    category_name VARCHAR(50) NOT NULL
);

--
-- Dumping data for table `category`
--
INSERT INTO category (category_number, category_name) VALUES
                                                          ('1', 'fruit'),
                                                          ('2', 'vegetables'),
                                                          ('3', 'meat'),
                                                          ('4', 'stationery'),
                                                          ('5', 'clothes');


-- --------------------------------------------------------

--
-- Table structure for table `product`
--
CREATE TABLE product
(
    id_product INTEGER PRIMARY KEY NOT NULL,
    category_number INTEGER NOT NULL REFERENCES category ON DELETE NO ACTION ON UPDATE CASCADE,
    product_name VARCHAR(50) NOT NULL,
    producer VARCHAR(50) NOT NULL,
    characteristics VARCHAR(100) NOT NULL
);

--
-- Dumping data for table `product`
--
-- INSERT INTO product (id_product, category_number, product_name, producer, characteristics) VALUES



-- --------------------------------------------------------

--
-- Table structure for table `store_product`
--
CREATE TABLE store_product
(
    UPC VARCHAR(12) PRIMARY KEY NOT NULL,
    UPC_prom VARCHAR(12) NULL REFERENCES store_product ON DELETE SET NULL ON UPDATE CASCADE,
    id_product INTEGER NOT NULL REFERENCES product ON DELETE NO ACTION ON UPDATE CASCADE,
    selling_price DECIMAL(13,4) NOT NULL,
    products_number INTEGER NOT NULL,
    promotional_product BOOLEAN NOT NULL
);

--
-- Dumping data for table `store_product`
--
-- INSERT INTO store_product (UPC, UPC_prom, id_product, selling_price, products_number, promotional_product) VALUES



-- --------------------------------------------------------

--
-- Table structure for table `receipt`
--
CREATE TABLE receipt
(
    check_number VARCHAR(10) PRIMARY KEY NOT NULL,
    id_employee VARCHAR(10) NOT NULL REFERENCES employee ON DELETE NO ACTION ON UPDATE CASCADE,
    card_number VARCHAR(13) NULL REFERENCES customer_card ON DELETE NO ACTION ON UPDATE CASCADE,
    print_date TIMESTAMP NOT NULL,
    sum_total DECIMAL(13,4) NOT NULL,
    vat DECIMAL(13,4) NOT NULL
);

--
-- Dumping data for table `receipt`
--
-- INSERT INTO receipt (check_number, id_employee, card_number, print_date, sum_total, vat) VALUES


-- --------------------------------------------------------

--
-- Table structure for table `sale`
--
CREATE TABLE sale
(
    UPC VARCHAR(12) NOT NULL REFERENCES store_product ON DELETE NO ACTION ON UPDATE CASCADE,
    check_number VARCHAR(10) NOT NULL REFERENCES receipt ON DELETE CASCADE ON UPDATE CASCADE,
    product_number INTEGER NOT NULL,
    selling_price DECIMAL(13,4) NOT NULL,
    PRIMARY KEY(UPC, check_number)
);

--
-- Dumping data for table `sale`
--
-- INSERT INTO sale (UPC, check_number, product_number, selling_price) VALUES


-- constraints
ALTER TABLE employee
    ADD CONSTRAINT check_employee_age CHECK (date_of_birth <= (CURRENT_DATE - INTERVAL '18 years'));

ALTER TABLE employee
    ADD CONSTRAINT salary_greater_than_zero CHECK (salary >= 0);

ALTER TABLE customer_card
    ADD CONSTRAINT percent_greater_than_zero CHECK (percent >= 0);

ALTER TABLE store_product
    ADD CONSTRAINT selling_price_greater_than_zero CHECK (selling_price >= 0);

ALTER TABLE store_product
    ADD CONSTRAINT products_number_greater_than_zero CHECK (products_number >= 0);

ALTER TABLE receipt
    ADD CONSTRAINT sum_total_greater_than_zero CHECK (sum_total >= 0);

ALTER TABLE receipt
    ADD CONSTRAINT vat_greater_than_zero CHECK (vat >= 0);

ALTER TABLE sale
    ADD CONSTRAINT product_number_greater_than_zero CHECK (product_number >= 0);

ALTER TABLE sale
    ADD CONSTRAINT selling_price_greater_than_zero CHECK (selling_price >= 0);
