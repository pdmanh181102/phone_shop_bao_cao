import ProductPageClient from "./product_page_client";

interface PageProps {
  searchParams: Promise<{
    page?: number;
    brand?: string;
    search?: string;
  }>;
}

const ProductsPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;

  const page = params.page || 1;
  const brand = params.brand || undefined;
  const search = params.search || undefined;

  return <ProductPageClient brand={brand} page={page} search={search} />;

  // const p = await fetchProductsOnServer({ page, brandUid: brand, search });

  // const {
  //   content: products,
  //   pageable: { pageNumber, pageSize },
  //   totalPages,
  // } = p;

  // return (
  //   <Flex vertical gap={10}>
  //     <ProductFilterComponent />

  //     <Row
  //       gutter={[10, 10]}
  //       style={{
  //         padding: 10,
  //         width: "100%",
  //         margin: 0,
  //         overflowX: "hidden",
  //         flexWrap: "wrap",
  //       }}
  //     >
  //       {products.map((product) => (
  //         <Col
  //           key={product.uid}
  //           xs={{
  //             span: 12,
  //           }}
  //           sm={{
  //             span: 8,
  //           }}
  //           md={{
  //             span: 6,
  //           }}
  //           lg={{
  //             span: 4,
  //           }}
  //         >
  //           <ProductCardComponent
  //             uid={product.uid}
  //             name={product.name}
  //             status={product.status}
  //             star={product.star}
  //             sold={product.soldQuantity}
  //             total={product.enteredQuantity}
  //             price={product.price}
  //           />
  //         </Col>
  //       ))}
  //     </Row>

  //     <PaginationComponent
  //       pageSize={pageSize}
  //       totalPages={totalPages}
  //       pageNumber={pageNumber}
  //     />
  //   </Flex>
  // );
};

export default ProductsPage;
