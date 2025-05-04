import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestController } from '../controllers/test.controller';
import { TestService } from '../services/test.service';
import { Test, TestSchema } from '../schemas/test.schema'; // Cambia la ruta según tu estructura de carpetas

@Module({
  imports: [MongooseModule.forFeature([{ name: Test.name, schema: TestSchema }])],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}