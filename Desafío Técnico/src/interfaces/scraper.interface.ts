export interface IScrappedData {
  page: number;
  scrappedData: IScrappedDataBody;
}

export interface IScrappedDataBody {
  images: string[];
  name: string;
  priceInfo: IPriceInfo;
  productSpecifications: IProductSpecifications[];
}

export interface IPriceInfo {
  priceAmount: string;
  priceDiscount: string;
}

export interface IProductSpecifications {
  name: string;
  specs: ISpecs[];
}

export interface ISpecs {
  [key: string]: string;
}
