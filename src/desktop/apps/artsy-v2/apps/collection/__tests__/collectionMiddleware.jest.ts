import { handleCollectionToArtistSeriesRedirect } from "../collectionMiddleware"

describe("handleCollectionToArtistSeriesRedirect", () => {
  it("does not redirect for a non-migrated artist series", () => {
    const req = {
      params: {
        collectionSlug: "not-artist-series",
      },
    }
    const res = {
      redirect: jest.fn(),
      locals: { sd: {} },
    }
    const next = jest.fn()

    handleCollectionToArtistSeriesRedirect(req, res, next)

    expect(res.redirect).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })

  it("does not redirect for a migrated artist series without the lab feature enabled", () => {
    const req = {
      params: {
        collectionSlug: "kaws-four-foot-companion",
      },
    }
    const res = {
      redirect: jest.fn(),
      locals: {
        sd: {
          CURRENT_USER: { id: "id" },
        },
      },
    }
    const next = jest.fn()

    handleCollectionToArtistSeriesRedirect(req, res, next)

    expect(res.redirect).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })

  it("redirects for a migrated series with the lab feature enabled", () => {
    const spy = jest.fn()
    const req = {
      params: {
        collectionSlug: "kaws-four-foot-companion",
      },
    }
    const res = {
      redirect: spy,
      locals: {
        sd: {
          CURRENT_USER: { lab_features: ["Artist Series"] },
        },
      },
    }

    const next = jest.fn()
    handleCollectionToArtistSeriesRedirect(req, res, next)
    expect(spy).toHaveBeenCalledWith(
      301,
      "/artist-series/kaws-4-foot-companion"
    )
    expect(next).not.toHaveBeenCalled()
  })
})