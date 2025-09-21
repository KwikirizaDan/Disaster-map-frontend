import React, { useState, useEffect } from "react";

const Docs = () => {
  const [docsData, setDocsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("react"); // default tab

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/disasters");
        if (!response.ok) {
          throw new Error("Failed to fetch docs");
        }
        const data = await response.json();
        setDocsData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading Docs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        Error: {error}
      </div>
    );
  }

  // Code snippets
  const codeSamples = {
    react: `
useEffect(() => {
  fetch("http://127.0.0.1:5000/api/disasters")
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
}, []);
    `,
    python: `
import requests

response = requests.get("http://127.0.0.1:5000/api/disasters")
if response.status_code == 200:
    print(response.json())
else:
    print("Error:", response.status_code)
    `,
    java: `
import java.net.*;
import java.io.*;

public class ApiExample {
  public static void main(String[] args) {
    try {
      URL url = new URL("http://127.0.0.1:5000/api/disasters");
      HttpURLConnection conn = (HttpURLConnection) url.openConnection();
      conn.setRequestMethod("GET");

      BufferedReader in = new BufferedReader(
        new InputStreamReader(conn.getInputStream())
      );
      String inputLine;
      StringBuffer content = new StringBuffer();
      while ((inputLine = in.readLine()) != null) {
        content.append(inputLine);
      }
      in.close();
      conn.disconnect();
      System.out.println(content.toString());
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
    `,
  };

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <div
        className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden"
        style={{ fontFamily: '"Public Sans", "Noto Sans", sans-serif' }}
      >
        <div className="layout-container flex h-full grow flex-col">
          <main className="flex-1 px-10 py-8">
            <div className="mx-auto max-w-7xl">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-gray-900 text-3xl font-bold leading-tight tracking-tight">
                  API Documentation
                </h1>
                <p className="text-gray-600 mt-2 text-sm">
                  Example requests and the raw response from{" "}
                  <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">
                    /api/disasters
                  </code>
                </p>
              </div>

              {/* Endpoint Response */}
              <section className="mb-10">
                <h2 className="text-gray-900 text-xl font-bold mb-4">
                  Endpoint Response
                </h2>
                <div className="rounded-md overflow-hidden border border-gray-300">
                  <pre className="bg-[#1e1e1e] text-gray-100 text-sm font-mono p-6 overflow-x-auto whitespace-pre-wrap max-h-[400px]">
                    {JSON.stringify(docsData, null, 2)}
                  </pre>
                </div>
              </section>

              {/* Code Examples */}
              <section>
                <h2 className="text-gray-900 text-xl font-bold mb-4">
                  Example Usage
                </h2>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-4">
                  <nav className="-mb-px flex space-x-8">
                    {["react", "python", "java"].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setActiveTab(lang)}
                        className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === lang
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Dark code block */}
                <div className="rounded-md overflow-hidden border border-gray-300">
                  <pre className="bg-[#1e1e1e] text-green-200 text-sm font-mono p-6 overflow-x-auto whitespace-pre max-h-[400px]">
                    {codeSamples[activeTab]}
                  </pre>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Docs;
