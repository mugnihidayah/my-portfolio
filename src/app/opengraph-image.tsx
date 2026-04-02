import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mugni Hidayah | AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#1e1e1e",
          fontFamily: '"Segoe UI", Inter, Arial, sans-serif',
        }}
      >
        {/* Background gradient circles */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,122,204,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(78,201,176,0.1) 0%, transparent 70%)",
          }}
        />

        {/* VS Code top bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "36px",
            backgroundColor: "#3c3c3c",
            display: "flex",
            alignItems: "center",
            paddingLeft: "16px",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#ff5f57",
            }}
          />
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#febc2e",
            }}
          />
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#28c840",
            }}
          />

          {/* Tab */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginLeft: "16px",
              backgroundColor: "#1e1e1e",
              padding: "4px 16px",
              borderTop: "2px solid #007acc",
              fontSize: "12px",
              color: "#ffffff",
            }}
          >
            <span style={{ color: "#007acc" }}>{"{ }"}</span>
            portfolio.tsx
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 16px",
              fontSize: "12px",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            about.md
          </div>
        </div>

        {/* Left sidebar hint */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "36px",
            bottom: "28px",
            width: "48px",
            backgroundColor: "#333333",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "16px",
            gap: "20px",
          }}
        >
          {["📁", "🔍", "🧩", "🤖"].map((icon, i) => (
            <div
              key={i}
              style={{
                fontSize: "18px",
                opacity: i === 0 ? 1 : 0.4,
              }}
            >
              {icon}
            </div>
          ))}
        </div>

        {/* Main content area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingLeft: "120px",
            paddingRight: "80px",
            paddingTop: "36px",
            paddingBottom: "28px",
            flex: 1,
            gap: "8px",
          }}
        >
          {/* Line numbers + code style */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              fontSize: "14px",
            }}
          >
            <span style={{ color: "#858585" }}>1</span>
            <span>
              <span style={{ color: "#c586c0" }}>export</span>
              <span style={{ color: "#d4d4d4" }}>{" const "}</span>
              <span style={{ color: "#4fc1ff" }}>developer</span>
              <span style={{ color: "#d4d4d4" }}>{" = {"}</span>
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              fontSize: "14px",
            }}
          >
            <span style={{ color: "#858585" }}>2</span>
            <span style={{ paddingLeft: "24px" }}>
              <span style={{ color: "#9cdcfe" }}>name</span>
              <span style={{ color: "#d4d4d4" }}>{": "}</span>
              <span style={{ color: "#ce9178" }}>&quot;Mugni Hidayah&quot;</span>
              <span style={{ color: "#d4d4d4" }}>,</span>
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              fontSize: "14px",
            }}
          >
            <span style={{ color: "#858585" }}>3</span>
            <span style={{ paddingLeft: "24px" }}>
              <span style={{ color: "#9cdcfe" }}>role</span>
              <span style={{ color: "#d4d4d4" }}>{": "}</span>
              <span style={{ color: "#ce9178" }}>&quot;AI Engineer&quot;</span>
              <span style={{ color: "#d4d4d4" }}>,</span>
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              fontSize: "14px",
            }}
          >
            <span style={{ color: "#858585" }}>4</span>
            <span style={{ paddingLeft: "24px" }}>
              <span style={{ color: "#9cdcfe" }}>skills</span>
              <span style={{ color: "#d4d4d4" }}>{": ["}</span>
              <span style={{ color: "#ce9178" }}>&quot;LLM&quot;</span>
              <span style={{ color: "#d4d4d4" }}>{", "}</span>
              <span style={{ color: "#ce9178" }}>&quot;NLP&quot;</span>
              <span style={{ color: "#d4d4d4" }}>{", "}</span>
              <span style={{ color: "#ce9178" }}>&quot;ML&quot;</span>
              <span style={{ color: "#d4d4d4" }}>{", "}</span>
              <span style={{ color: "#ce9178" }}>&quot;Python&quot;</span>
              <span style={{ color: "#d4d4d4" }}>],</span>
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              fontSize: "14px",
            }}
          >
            <span style={{ color: "#858585" }}>5</span>
            <span style={{ paddingLeft: "24px" }}>
              <span style={{ color: "#9cdcfe" }}>status</span>
              <span style={{ color: "#d4d4d4" }}>{": "}</span>
              <span style={{ color: "#ce9178" }}>&quot;Available for hire&quot;</span>
              <span style={{ color: "#d4d4d4" }}>,</span>
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              fontSize: "14px",
            }}
          >
            <span style={{ color: "#858585" }}>6</span>
            <span>
              <span style={{ color: "#d4d4d4" }}>{"}"}</span>
            </span>
          </div>

          {/* Big name overlay */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "32px",
              gap: "4px",
            }}
          >
            <div
              style={{
                fontSize: "52px",
                fontWeight: "bold",
                color: "#ffffff",
                lineHeight: 1.1,
              }}
            >
              Mugni Hidayah
            </div>
            <div
              style={{
                fontSize: "24px",
                color: "#007acc",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#4ec9b0",
                }}
              />
              AI Engineer
            </div>
          </div>
        </div>

        {/* Right side decoration — terminal hint */}
        <div
          style={{
            position: "absolute",
            right: "40px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            opacity: 0.15,
          }}
        >
          {[
            "$ python train.py",
            "Epoch 1/100 ████░░ 42%",
            "$ deploy --prod",
            "✓ Model deployed",
            "$ chat --ai",
            "> Hello! 🤖",
          ].map((line, i) => (
            <div
              key={i}
              style={{
                fontSize: "13px",
                color: "#4ec9b0",
                whiteSpace: "nowrap",
              }}
            >
              {line}
            </div>
          ))}
        </div>

        {/* Bottom status bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "28px",
            backgroundColor: "#007acc",
            display: "flex",
            alignItems: "center",
            paddingLeft: "16px",
            paddingRight: "16px",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              fontSize: "12px",
              color: "#ffffff",
            }}
          >
            <span>⎇ main</span>
            <span>✓ 0 Problems</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              fontSize: "12px",
              color: "#ffffff",
            }}
          >
            <span>🟢 Available</span>
            <span>TypeScript React</span>
            <span>UTF-8</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
