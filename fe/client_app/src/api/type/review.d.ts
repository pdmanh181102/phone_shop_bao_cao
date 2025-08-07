export interface CreateReviewRequest {
  order_item_uid: string;
  review_content: string;
  star: number;
}


export interface Review {
  uid: string;
  reviewContent: string;
  star: number;
  date: string;
  orderItemUid: string;
  productUid: string;
  productName: string;
  customerName: string;
}

export interface ReviewResponse extends Review { }