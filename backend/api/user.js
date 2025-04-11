import protect from "../middlewares/protect.js";
import userService from "../services/user-service.js";
import { upload } from "../utils/multer.js";

const user = (app) => {
    const service = new userService();

    app.post("/api/v1/user/fetch-users", protect, async (req, res, next) => {
        try {
            if (!req.user.isAdmin) {
                return res.status(403).json({ message: "Not authorized to fetch users" });  // Only admin can fetch users
            }
            const { status, ...rest } = await service.FetchUsers(req.body);
            return res.status(status).json({ ...rest });

        } catch (err) {
            next(err);
        }
    });

    app.post("/api/v1/user/upload-profile-photo", protect, upload.single('profilePic'), async (req, res, next) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "No file provided" });
            }
            const maxFileSize = 2 * 1024 * 1024;
            if (req.file.size > maxFileSize) {
                return res.status(400).json({ message: "File is too large. Max file size is 2MB." });
            }

            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/x-icon'];
            if (!allowedMimeTypes.includes(req.file.mimetype)) {
                return res.status(400).json({ message: "Invalid file type. Only JPG, PNG and ICON are allowed." });
            }

            const { status, ...rest } = await service.UploadProfilePhoto(req.file);
            return res.status(status).json({ ...rest });

        } catch (err) {
            next(err);
        }
    });

    app.get("/api/v1/user/fetch-user-by-id", protect, async (req, res, next) => {
        try {

            const { status, ...rest } = await service.FetchUserByUserId(req.query.userId);
            return res.status(status).json({ ...rest });

        } catch (err) {
            next(err);
        }
    });

    app.patch("/api/v1/user/update-user", protect, async (req, res, next) => {
        try {

            const { status, ...rest } = await service.UpdateUser(req, req.body);
            return res.status(status).json({ ...rest });

        } catch (err) {
            next(err);
        }
    });


    app.delete("/api/v1/user/delete-user", protect, async (req, res, next) => {
        try {

            const { status, ...rest } = await service.DeleteUser(req);
            return res.status(status).json({ ...rest });

        } catch (err) {
            next(err);
        }
    });
};

export default user;
