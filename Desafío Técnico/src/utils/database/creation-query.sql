CREATE TABLE tbl_product(
	prod_id INT NOT NULL PRIMARY KEY IDENTITY (1, 1),
	prod_name VARCHAR(200) NOT NULL,
	prod_current_price VARCHAR(200) NOT NULL,
	prod_current_discount VARCHAR(200) NULL,
	prod_current_page INT NOT NULL,
	prod_is_valid BIT NOT NULL DEFAULT 1,
	prod_created_at DATETIME NOT NULL DEFAULT GETDATE(),
	prod_updated_at DATETIME NOT NULL DEFAULT GETDATE(),
	prod_deleted_at DATETIME NULL
);
GO

CREATE TABLE tbl_product_image(
	primg_id INT NOT NULL PRIMARY KEY IDENTITY (1, 1),
	primg_url TEXT NOT NULL,
	prod_id INT NOT NULL FOREIGN KEY REFERENCES tbl_product(prod_id),
	primg_is_valid BIT NOT NULL DEFAULT 1,
	primg_created_at DATETIME NOT NULL DEFAULT GETDATE(),
	primg_updated_at DATETIME NOT NULL DEFAULT GETDATE(),
	primg_deleted_at DATETIME NULL
);
GO

CREATE TABLE tbl_product_specification_category(
	prspca_id INT NOT NULL PRIMARY KEY IDENTITY (1, 1),
	prspca_name VARCHAR(200) NOT NULL,
	prod_id INT NOT NULL FOREIGN KEY REFERENCES tbl_product(prod_id),
	prspca_is_valid BIT NOT NULL DEFAULT 1,
	prspca_created_at DATETIME NOT NULL DEFAULT GETDATE(),
	prspca_updated_at DATETIME NOT NULL DEFAULT GETDATE(),
	prspca_deleted_at DATETIME NULL
);
GO

CREATE TABLE tbl_product_specification_property(
	pdsppr_id INT NOT NULL PRIMARY KEY IDENTITY (1, 1),
	prspca_id INT NOT NULL FOREIGN KEY REFERENCES tbl_product_specification_category(prspca_id),
	pdsppr_name VARCHAR(200) NOT NULL,
	pdsppr_value VARCHAR(200) NOT NULL,
	pdsppr_is_valid BIT NOT NULL DEFAULT 1,
	pdsppr_created_at DATETIME NOT NULL DEFAULT GETDATE(),
	pdsppr_updated_at DATETIME NOT NULL DEFAULT GETDATE(),
	pdsppr_deleted_at DATETIME NULL
);
GO