// src/App.tsx
import "./App.css";
import { useEffect, useState } from "react";
import { onValue, orderByChild, query, ref } from "firebase/database";

import { useAuth } from "./authContext";
import PostAdWizard from "./PostAdWizard";
import { rtdb } from "./firebase";
import type { AdCategory, BuyerAd, PostingRole } from "./types";

import Header from "./components/Header";
import AuthPanel from "./components/AuthPanel";
import FiltersSidebar from "./components/FiltersSidebar";
import BuyerAdsFeed from "./components/BuyerAdsFeed";
import AdDetailsModal from "./components/AdDetailsModal";
import SellForm from "./components/SellForm";
import AdminPage from "./components/AdminPage";

const MOCK_ADS: BuyerAd[] = [
  {
    id: "seed-1",
    title: "Buying FreeStyle Lite 100ct",
    productType: "Test Strips",
    category: "Test Strips",
    city: "Atlanta",
    state: "GA",
    zip: "30301",
    price: 40,
    buyerName: "ATL Buyer Co.",
    premium: true,
    note: "Posted Aug 12, 2025",
    createdAt: 1755033600000,
  },
  {
    id: "seed-2",
    title: "OneTouch Ultra 50ct",
    productType: "Test Strips",
    category: "Test Strips",
    city: "Atlanta",
    state: "GA",
    zip: "30309",
    price: 20,
    buyerName: "Midtown Meds",
    premium: true,
    note: "Posted Aug 12, 2025",
    createdAt: 1755033600000,
  },
  {
    id: "seed-3",
    title: "Dexcom G6 Sensors (3pk)",
    productType: "Devices",
    category: "Devices",
    city: "Atlanta",
    state: "GA",
    zip: "30318",
    price: 195,
    buyerName: "Westside Health",
    premium: true,
    note: "Posted Aug 12, 2025",
    createdAt: 1755033600000,
  },
  {
    id: "seed-4",
    title: "Lancers 200ct",
    productType: "Supplies",
    category: "Supplies",
    city: "Decatur",
    state: "GA",
    zip: "30030",
    price: 10,
    buyerName: "Quick Pay",
    note: "Posted Aug 12, 2025",
    createdAt: 1755033600000,
  },
  {
    id: "seed-5",
    title: "FreeStyle Freedom Lite Meter",
    productType: "Devices",
    category: "Devices",
    city: "Austin",
    state: "TX",
    zip: "73301",
    price: 30,
    buyerName: "UPS label provided",
    note: "Posted Aug 12, 2025",
    createdAt: 1755033600000,
  },
  {
    id: "seed-6",
    title: "Accu-Chek Guide 50ct",
    productType: "Test Strips",
    category: "Test Strips",
    city: "New York",
    state: "NY",
    zip: "10001",
    price: 22,
    buyerName: "Bulk welcome",
    note: "Posted Aug 12, 2025",
    createdAt: 1755033600000,
  },
];

function App() {
  // include `role` from authContext
  const { user, loading, role } = useAuth();

  const [showAuthPanel, setShowAuthPanel] = useState(false);

  // 👇 add "admin" to the union
  const [activeTab, setActiveTab] = useState<
    "home" | "sell" | "messages" | "admin"
  >("home");

  const [showPostWizard, setShowPostWizard] = useState(false);
  const [showAdminPostWizard, setShowAdminPostWizard] = useState(false); // 👈 NEW

  const [ads, setAds] = useState<BuyerAd[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "gallery">("gallery");

  const [selectedAdIndex, setSelectedAdIndex] = useState<number | null>(null);
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);

  // Guests can choose seller/buyer; logged-in users are locked to their auth role
  const [guestPostingRole, setGuestPostingRole] =
    useState<PostingRole>("seller");

  const isGuest = !user;

  const effectivePostingRole: PostingRole = isGuest
    ? guestPostingRole
    : role === "buyer"
    ? "buyer"
    : role === "wholesaler"
    ? "wholesaler"
    : "seller";

  const adsToShow: BuyerAd[] = ads.length ? ads : MOCK_ADS;

  const selectedAd =
    selectedAdIndex !== null ? adsToShow[selectedAdIndex] : null;

  const hasPrev = selectedAdIndex !== null && selectedAdIndex > 0;
  const hasNext =
    selectedAdIndex !== null && selectedAdIndex < adsToShow.length - 1;

  useEffect(() => {
    const adsQuery = query(ref(rtdb, "ads"), orderByChild("createdAt"));

    const unsubscribe = onValue(adsQuery, (snapshot) => {
      const val = snapshot.val();

      if (!val) {
        setAds([]);
        return;
      }

      const list: BuyerAd[] = Object.entries(val).map(([key, raw]) => {
        const data = raw as any;
        return {
          id: key,
          title: data.title ?? "",
          productType: data.productType ?? "",
          category: (data.category as AdCategory) ?? "Test Strips",
          city: data.city ?? "",
          state: data.state ?? "",
          zip: data.zip ?? "",
          price: data.price ?? 0,
          buyerName: data.buyerName ?? data.contactEmail ?? "Buyer",
          contactEmail: data.contactEmail ?? undefined,
          contactPhone: data.contactPhone ?? undefined,
          premium: !!data.premium,
          note: data.note ?? undefined,
          createdAt: data.createdAt ?? null,
          mainImageUrl: data.mainImageUrl ?? undefined,
          imageUrls: (data.imageUrls as string[]) ?? undefined,
          postingRole: (data.postingRole as PostingRole | undefined) ?? undefined,
        };
      });

      list.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
      setAds(list);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenAd = (index: number) => {
    const ad = adsToShow[index];
    setSelectedAdIndex(index);
    const firstImage =
      ad.mainImageUrl || (ad.imageUrls && ad.imageUrls[0]) || null;
    setActiveImageUrl(firstImage);
  };

  const handleCloseAd = () => {
    setSelectedAdIndex(null);
    setActiveImageUrl(null);
  };

  const goPrev = () => {
    if (!hasPrev || selectedAdIndex === null) return;
    const nextIndex = selectedAdIndex - 1;
    const ad = adsToShow[nextIndex];
    const firstImage =
      ad.mainImageUrl || (ad.imageUrls && ad.imageUrls[0]) || null;
    setSelectedAdIndex(nextIndex);
    setActiveImageUrl(firstImage);
  };

  const goNext = () => {
    if (!hasNext || selectedAdIndex === null) return;
    const nextIndex = selectedAdIndex + 1;
    const ad = adsToShow[nextIndex];
    const firstImage =
      ad.mainImageUrl || (ad.imageUrls && ad.imageUrls[0]) || null;
    setSelectedAdIndex(nextIndex);
    setActiveImageUrl(firstImage);
  };

  return (
    <div className="tsm-app">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onPostClick={() => {
          if (!user) {
            // not logged in → show auth panel instead of post wizard
            setShowAuthPanel(true);
          } else {
            setShowPostWizard(true);
          }
        }}
        onAccountClick={() => setShowAuthPanel((v) => !v)}
        userEmail={user?.email ?? null}
        loading={loading}
        isGuest={isGuest}
        userRole={role}
        postingRole={effectivePostingRole}
        onPostingRoleChange={(newRole) => {
          if (isGuest) {
            // guests can only be seller/buyer
            if (newRole === "wholesaler") return;
            setGuestPostingRole(newRole);
          }
        }}
      />

      {/* AUTH MODAL */}
      {showAuthPanel && (
        <div
          className="tsm-modal-backdrop"
          onClick={() => setShowAuthPanel(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="tsm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <AuthPanel onClose={() => setShowAuthPanel(false)} />
          </div>
        </div>
      )}

      {/* POST AD WIZARD – normal user flow */}
      {showPostWizard && (
        <div
          className="tsm-modal-backdrop"
          onClick={() => setShowPostWizard(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="tsm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <PostAdWizard
              onClose={() => setShowPostWizard(false)}
              defaultEmail={user?.email ?? ""}
              ownerUid={user ? (user as any).uid ?? null : null}
              postingRole={effectivePostingRole}
            />
          </div>
        </div>
      )}

      {/* POST AD WIZARD – ADMIN flow (unclaimed buyer ads) */}
      {showAdminPostWizard && (
        <div
          className="tsm-modal-backdrop"
          onClick={() => setShowAdminPostWizard(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="tsm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <PostAdWizard
              onClose={() => setShowAdminPostWizard(false)}
              defaultEmail={""}              // start blank
              ownerUid={null}                 // 👈 unclaimed
              postingRole={"buyer"}           // 👈 always buyer ad for now
            />
          </div>
        </div>
      )}

      {/* AD DETAILS MODAL */}
      {selectedAd && (
        <AdDetailsModal
          ad={selectedAd}
          hasPrev={hasPrev}
          hasNext={hasNext}
          onPrev={goPrev}
          onNext={goNext}
          onClose={handleCloseAd}
          activeImageUrl={activeImageUrl}
          onChangeImage={setActiveImageUrl}
        />
      )}

      {/* MAIN */}
      <main className="tsm-main">
        {activeTab === "home" && (
          <>
            <FiltersSidebar />
            <BuyerAdsFeed
              ads={adsToShow}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onAdClick={handleOpenAd}
            />
          </>
        )}

        {activeTab === "sell" &&
          (user ? (
            <SellForm user={user} postingRole={effectivePostingRole} />
          ) : (
            <section
              className="tsm-feed"
              style={{
                padding: "3rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "0.75rem",
              }}
            >
              <h1 className="tsm-feed-title">Sign in to post</h1>
              <p className="tsm-feed-subtitle">
                You need a free Test Strip Marketplace account to post buyer,
                seller, or wholesaler ads.
              </p>
              <button
                className="tsm-btn-primary"
                onClick={() => setShowAuthPanel(true)}
                style={{
                  width: "auto",
                  paddingInline: "1.5rem",
                  marginTop: "0.5rem",
                }}
              >
                Sign in or create account
              </button>
            </section>
          ))}

        {activeTab === "messages" && (
          <section
            className="tsm-feed"
            style={{ padding: "3rem", justifyContent: "center" }}
          >
            <h1 className="tsm-feed-title">Messages</h1>
            <p className="tsm-feed-subtitle">
              In-app messaging is coming soon.
            </p>
          </section>
        )}

        {activeTab === "admin" && role === "admin" && (
          <AdminPage onPostClick={() => setShowAdminPostWizard(true)} />
        )}
      </main>

      <footer className="tsm-footer">
        <span>© 2025 Test Strip Marketplace</span>
        <div className="tsm-footer-links">
          <button>Privacy</button>
          <button>Terms</button>
          <button>Contact</button>
        </div>
      </footer>
    </div>
  );
}

export default App;
