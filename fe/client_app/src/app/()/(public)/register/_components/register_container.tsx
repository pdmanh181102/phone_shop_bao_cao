// (auth)/register/_components/RegisterContainer.tsx
import React from "react";

interface RegisterContainerProps {
  title: string;
  children: React.ReactNode;
}

const RegisterContainer: React.FC<RegisterContainerProps> = ({
  title,
  children,
}) => {
  return (
    <div style={styles.wrapper}>
      <div style={styles.box}>
        <h2 style={styles.title}>{title}</h2>
        {children}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    minHeight: "100vh",
    background: "#f0f2f5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    background: "#fff",
    padding: "32px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    marginBottom: "24px",
    textAlign: "center",
  },
};

export default RegisterContainer;
