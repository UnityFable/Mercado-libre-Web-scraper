export interface IProduct {
  prod_id: number;
  prod_name: string;
  prod_current_price: string;
  prod_current_discount: string;
  prod_current_page: number;
  prod_is_valid: number | boolean;
  prod_created_at: Date | string;
  prod_updated_at: Date | string;
  prod_deleted_at: Date | string;
}

export interface IProductImage {
  primg_id: number;
  primg_url: string;
  prod_id: number;
  primg_is_valid: number | boolean;
  primg_created_at: Date | string;
  primg_updated_at: Date | string;
  primg_deleted_at: Date | string;
}

export interface IProductSpecificationCategory {
  prspca_id: number;
  prspca_name: string;
  prod_id: number;
  prspca_is_valid: number | boolean;
  prspca_created_at: Date | string;
  prspca_updated_at: Date | string;
  prspca_deleted_at: Date | string;
}

export interface IProductSpecificationProperty {
  pdsppr_id: number;
  prspca_id: number;
  pdsppr_name: string;
  pdsppr_value: string;
  pdsppr_is_valid: number | boolean;
  pdsppr_created_at: Date | string;
  pdsppr_updated_at: Date | string;
  pdsppr_deleted_at: Date | string;
}
