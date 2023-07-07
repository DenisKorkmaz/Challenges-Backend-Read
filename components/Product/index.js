import useSWR from "swr";
import { useRouter } from "next/router";
import { ProductCard } from "./Product.styled";
import { StyledLink } from "../Link/Link.styled";
import { useState } from "react";
import { StyledButton } from "../Button/Button.styled";
import ProductForm from "../ProductForm";  

export default function Product() {
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading, mutate } = useSWR(`/api/products/${id}`);

  const [isEditMode, setIsEditMode] = useState(false);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!data) {
    return;
  }

  const handleEditProduct = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const productData = Object.fromEntries(formData);

    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData)
    });

    if (response.ok) {
      mutate();
    }
  };

  const handleDeleteProduct = async (id) => {
    const response = await fetch(`/api/products/${id}`, { method: "DELETE" });

    if (response.ok) {
      router.push("/");
    } else {
      console.error(`Error: ${response.status}`);
    }
  };

  return (
    <ProductCard>
      <h2>{data.name}</h2>
      <p>Description: {data.description}</p>
      <p>
        Price: {data.price} {data.currency}
      </p>
      <div>
        <h3>Reviews</h3>
        {data.reviews.map((review, index) => (
          <div key={index}>
            <h4>{review.title}</h4>
            <p>{review.text}</p>
            <p>Rating: {review.rating}</p>
          </div>
        ))}
      </div>
      {isEditMode && <ProductForm onSubmit={handleEditProduct} heading="Edit Product" />}
      <StyledButton type="button" onClick={() => setIsEditMode(!isEditMode)}>
        {isEditMode ? "Cancel" : "✏️"}
      </StyledButton>
      <StyledButton type="button" onClick={() => handleDeleteProduct(id)}>
       ❌
      </StyledButton>
      <StyledLink href="/">🔙</StyledLink>
    </ProductCard>
  );
}
