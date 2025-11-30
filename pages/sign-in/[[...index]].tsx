// pages/sign-in.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div
            style={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                overflow: "hidden",
                justifyContent: "center",
                alignItems: "center",
                background: "radial-gradient(circle at bottom right, #FF8C42 15%, #E8EBF1 85%)",
                fontFamily: "'Inter', sans-serif",
            }}
        >


            {/* Split-screen container */}
            <div
                style={{
                    width: "70%",
                    maxWidth: "1400px",
                    height: "80vh",
                    display: "flex",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                }}
            >
                {/* Form side */}
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "#ffffff"




                    }}
                >
                    <div style={{ width: "100%", maxWidth: "450px" }}>

                        <SignIn
                            appearance={{
                                elements: {
                                    card: {
                                        width: "100%",
                                        height: "425px",
                                        border: "none",
                                        background: "#ffffff",
                                        boxShadow: "none",

                                    },
                                    form: {
                                        width: "100%",

                                    },


                                    formFieldInput: {
                                        width: "100%",
                                        borderRadius: "10px",
                                        padding: "20px 16px",
                                        border: "5px solid #FF8C42",
                                        fontSize: "15px",
                                    },

                                    formFieldLabel: {
                                        fontSize: "15px",
                                        fontWeight: 200,
                                    },

                                    headerTitle: {
                                        fontSize: "15px",
                                        fontWeight: 700,
                                        fontFamily: "'Nunito', sans-serif",
                                        color: "#111",
                                        marginBottom: "10px",
                                    },



                                    headerSubtitle: {
                                        fontSize: "15px",
                                        color: "#555",
                                    },


                                    formButtonPrimary: {
                                        width: "100%",
                                        background: "#FF8C42",
                                        color: "white",
                                        fontSize: "18px",
                                        fontWeight: 600,
                                        borderRadius: "10px",
                                        padding: "10px 0",
                                        border: "none !important",
                                        outline: "none !important",
                                        boxShadow: "none !important",
                                        appearance: "none",
                                    }

                                    ,

                                    socialButtons: {
                                        width: "100%",
                                        padding: "10px",



                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                {/* RIGHT: Image side */}
                <div
                    style={{
                        flex: 1.5,
                        backgroundImage: "url('/images/login.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
            </div>
        </div >
    );
}
