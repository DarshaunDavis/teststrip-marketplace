// src/App.tsx
import "./App.css";
import { useEffect, useState } from "react";
import { onValue, orderByChild, query, ref } from "firebase/database";

import { useAuth } from "./authContext";
import PostAdWizard from "./PostAdWizard";
import { rtdb } from "./firebase";
import type { BuyerAd, PostingRole, AdFilters, AdCategory } from "./types";

import { MOCK_ADS } from "./data/mockAds";
import { DEFAULT_FILTERS, applyFiltersForFeed } from "./utils/adFeed";

import Header from "./components/Header";
import Footer from "./components/Footer";
import AuthPanel from "./components/AuthPanel";
import FiltersSidebar from "./components/FiltersSidebar";
import BuyerAdsFeed from "./components/BuyerAdsFeed";
import AdDetailsModal from "./components/AdDetailsModal";
import SellForm from "./components/SellForm";
import AdminPage from "./components/AdminPage";
import DirectoryBuyerWizard from "./components/DirectoryBuyerWizard";

function App() {
  const { user, loading, role } = useAuth();

  const [showAuthPanel, setShowAuthPanel] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "home" | "sell" | "messages" | "admin"
  >("home");

  const [showPostWizard, setShowPostWizard] = useState(false);
  const [showAdminPostWizard, setShowAdminPostWizard] = useState(false);

  const [ads, setAds] = useState<BuyerAd[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "gallery">("gallery");

  const [selectedAdIndex, setSelectedAdIndex] = useState<number | null>(null);
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);

  // See-all-ads toggle (role-based filtering)
  const [showAllAds, setShowAllAds] = useState(false);

  // Guests can choose seller/buyer; logged-in users are locked to their auth role
  const [guestPostingRole, setGuestPostingRole] =
    useState<PostingRole>("seller");

  const [filters, setFilters] = useState<AdFilters>(DEFAULT_FILTERS);

  // NEW: mobile filters drawer state
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const isGuest = !user;

  const effectivePostingRole: PostingRole = isGuest
    ? guestPostingRole
    : role === "buyer"
    ? "buyer"
    : role === "wholesaler"
    ? "wholesaler"
    : "seller";

  const adsBase: BuyerAd[] = ads.length ? ads : MOCK_ADS;

  const filteredAds: BuyerAd[] = applyFiltersForFeed(adsBase, filters);

  const selectedAd =
    selectedAdIndex !== null ? filteredAds[selectedAdIndex] : null;

  const hasPrev = selectedAdIndex !== null && selectedAdIndex > 0;
  const hasNext =
    selectedAdIndex !== null && selectedAdIndex < filteredAds.length - 1;

  const [showDirectoryBuyerWizard, setShowDirectoryBuyerWizard] = useState(false);

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
          postingRole:
            (data.postingRole as PostingRole | undefined) ?? undefined,
        };
      });

      list.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
      setAds(list);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenAd = (index: number) => {
    const ad = filteredAds[index];
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
    const ad = filteredAds[nextIndex];
    const firstImage =
      ad.mainImageUrl || (ad.imageUrls && ad.imageUrls[0]) || null;
    setSelectedAdIndex(nextIndex);
    setActiveImageUrl(firstImage);
  };

  const goNext = () => {
    if (!hasNext || selectedAdIndex === null) return;
    const nextIndex = selectedAdIndex + 1;
    const ad = filteredAds[nextIndex];
    const firstImage =
      ad.mainImageUrl || (ad.imageUrls && ad.imageUrls[0]) || null;
    setSelectedAdIndex(nextIndex);
    setActiveImageUrl(firstImage);
  };

  // Shared logic for "Post" from header + FAB
  const handlePostClick = () => {
    if (!user) {
      setShowAuthPanel(true);
    } else {
      setShowPostWizard(true);
    }
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <div className="tsm-app">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onPostClick={handlePostClick}
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

      {/* Mobile floating Post Ad button (hidden on desktop via CSS) */}
      <button className="tsm-fab-post-ad" onClick={handlePostClick}>
        Post Ad
      </button>

      {/* AUTH MODAL */}
      {showAuthPanel && (
        <div
          className="tsm-modal-backdrop"
          onClick={() => setShowAuthPanel(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="tsm-modal" onClick={(e) => e.stopPropagation()}>
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
          <div className="tsm-modal" onClick={(e) => e.stopPropagation()}>
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
          <div className="tsm-modal" onClick={(e) => e.stopPropagation()}>
            <PostAdWizard
              onClose={() => setShowAdminPostWizard(false)}
              defaultEmail={""} // start blank
              ownerUid={null} // 👈 unclaimed
              postingRole={"buyer"} // 👈 always buyer ad for now
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

      {showDirectoryBuyerWizard && (
  <div
    className="tsm-modal-backdrop"
    onClick={() => setShowDirectoryBuyerWizard(false)}
    role="dialog"
    aria-modal="true"
  >
    <div className="tsm-modal" onClick={(e) => e.stopPropagation()}>
      <DirectoryBuyerWizard onClose={() => setShowDirectoryBuyerWizard(false)} />
    </div>
  </div>
)}

      {/* MAIN */}
      <main className="tsm-main">
        {activeTab === "home" && (
          <>
            {/* Desktop filters sidebar (hidden on mobile via CSS) */}
            <FiltersSidebar
              filters={filters}
              onFiltersChange={setFilters}
              onReset={handleResetFilters}
            />

            {/* Feed column with mobile filters button + feed */}
            <div className="tsm-feed-column">
              <div className="tsm-feed-mobile-filters-bar">
                <button
                  type="button"
                  className="tsm-btn-filters-mobile"
                  onClick={() => setShowFiltersMobile(true)}
                >
                  Filters
                </button>
              </div>

              <BuyerAdsFeed
                ads={filteredAds}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onAdClick={handleOpenAd}
                userRole={role}
                showAllAds={showAllAds}
                onToggleShowAll={() => setShowAllAds((prev) => !prev)}
              />
            </div>
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
          <AdminPage
  onPostClick={() => setShowAdminPostWizard(true)}
  onAddDirectoryBuyerClick={() => setShowDirectoryBuyerWizard(true)}
/>
        )}
      </main>

      {/* MOBILE FILTERS DRAWER */}
      {showFiltersMobile && (
        <div
          className="tsm-filters-mobile-overlay"
          onClick={() => setShowFiltersMobile(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="tsm-filters-mobile-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tsm-filters-mobile-header">
              <span className="tsm-filters-mobile-title">Filters</span>
              <button
                type="button"
                className="tsm-filters-mobile-close"
                onClick={() => setShowFiltersMobile(false)}
              >
                ✕
              </button>
            </div>

            {/* Reuse the same FiltersSidebar component inside the drawer */}
            <FiltersSidebar
              filters={filters}
              onFiltersChange={setFilters}
              onReset={handleResetFilters}
            />

            <div className="tsm-filters-mobile-footer">
              <button
                type="button"
                className="tsm-btn-secondary tsm-filters-mobile-btn"
                onClick={() => {
                  handleResetFilters();
                }}
              >
                Reset
              </button>
              <button
                type="button"
                className="tsm-btn-primary tsm-filters-mobile-btn"
                onClick={() => setShowFiltersMobile(false)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      
    <Footer />
    </div>
  );
}

export default App;
