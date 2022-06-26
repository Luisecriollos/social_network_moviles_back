import express, { Request, Response } from 'express';
import { IUser } from '../../interfaces/auth';
import response from '../../network/response';
import controller from './controller';

const router = express.Router();

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const token = await controller.login(email, password);
    response.success(req, res, {
      message: 'Sesion iniciado con exito',
      body: token,
    });
  } catch (error: any) {
    response.error(req, res, {
      details: error,
      message: 'Usuario o contrasena invalida.',
    });
  }
};

const register = async (req: Request, res: Response) => {
  const user: IUser = req.body;

  if (!user.email || !user.password || !user.name) {
    res.status(400).json({
      error: 'No ha ingresado los datos correctamente, por favor intente de nuevo.',
    });
    return;
  }
  try {
    const exists = await controller.listRegistries({ email: user.email }).then((res) => res[0]);
    if (exists) {
      return response.error(req, res, {
        message: 'Ya existe un usuario con el correo/identificacion ingresado.',
        status: 401,
        details: 'register user function [registerUser]',
      });
    }
    const resData = await controller.register(user);
    response.success(req, res, {
      message: 'User registered successfully!',
      status: 201,
      body: resData,
    });
  } catch (error: any) {
    return response.error(req, res, {
      message: error.message,
      status: 500,
      details: '[Register] Error when registering user',
    });
  }
};

router.post('/register', register);
router.post('/login', login);

export default router;
