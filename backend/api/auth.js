import protect from "../middlewares/protect.js";
import authService from "../services/auth-service.js";

const auth = (app) => {
  const service = new authService();

  app.post("/api/v1/auth/register", async (req, res, next) => {
    try {

      const { status, ...rest } = await service.Register(req.body);
      return res.status(status).json({ ...rest });

    } catch (err) {
      next(err);
    }
  });

  app.post("/api/v1/auth/login", async (req, res, next) => {
    try {

      const { status, ...rest } = await service.Login(req.body);
      return res.status(status).json({ ...rest });

    } catch (err) {
      next(err);
    }
  });

  app.post("/api/v1/auth/OAuth-signIn", async (req, res, next) => {
    try {

      const { status, ...rest } = await service.OAuthSignIn(req.body);
      return res.status(status).json({ ...rest });

    } catch (err) {
      next(err);
    }
  });


  app.get("/api/v1/auth/verify/:token", async (req, res, next) => {
    try {

      const { token } = req.params;
      const { status, ...rest } = await service.VerifyToken(req, token);
      return res.status(status).json({ ...rest });

    } catch (err) {
      next(err);
    }
  });

  app.get("/api/v1/auth/me", protect, async (req, res, next) => {
    try {

      const { status, ...rest } = await service.Me(req.user);
      return res.status(status).json({ ...rest });

    } catch (err) {
      next(err);
    }
  });


  app.post("/api/v1/auth/request-forgot-password", async (req, res, next) => {
    try {

      const { status, ...rest } = await service.forgotPasswordRequestUrl(req.body);
      return res.status(status).json({ ...rest });

    } catch (err) {
      next(err);
    }
  });

  app.post(
    "/api/v1/auth/forgotPassword/verify/:token",
    async (req, res, next) => {
      try {

        const { token } = req.params;
        const { newPassword } = req.body;
        const { status, ...rest } = await service.ChangeUserPassword(req, token, newPassword);
        return res.status(status).json({ ...rest });

      } catch (err) {
        next(err);
      }
    }
  );

  app.post(
    "/api/v1/auth/changePassword",
    protect,
    async (req, res, next) => {
      try {

        const { status, ...rest } = await service.ChangePassword(req, req.body);
        return res.status(status).json({ ...rest });

      } catch (err) {
        next(err);
      }
    }
  );

};

export default auth;
