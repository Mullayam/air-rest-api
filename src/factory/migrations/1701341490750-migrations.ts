import { MigrationInterface, QueryRunner } from "typeorm"

export  class Migrations1701341490750 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        -- Table: public.admin

        -- DROP TABLE IF EXISTS public.admin;
        
        CREATE TABLE IF NOT EXISTS public.admin
        (
            id uuid NOT NULL DEFAULT uuid_generate_v4(),
            fullname character varying COLLATE pg_catalog."default",
            username character varying COLLATE pg_catalog."default" NOT NULL,
            email character varying COLLATE pg_catalog."default" NOT NULL,
            password character varying COLLATE pg_catalog."default" NOT NULL,
            status character varying COLLATE pg_catalog."default" NOT NULL DEFAULT 'Active'::character varying,
            role character varying COLLATE pg_catalog."default" NOT NULL DEFAULT 'Admin'::character varying,
            created_at timestamp without time zone NOT NULL DEFAULT now(),
            CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY (id),
            CONSTRAINT "UQ_5e568e001f9d1b91f67815c580f" UNIQUE (username),
            CONSTRAINT "UQ_de87485f6489f5d0995f5841952" UNIQUE (email)
        )
        
        TABLESPACE pg_default;
        `)
        await queryRunner.query(
            `INSERT INTO "admin" ("fullname", "username", "email", "password", "status", "role", "created_at") VALUES ('SuperAdmin', 'admin', 'a@admin.com', '$2a$10$n4cXZonjEEjvpCXpV2CYKeWVWnhmrAI/nTpHoSESFP9o6XoX22ENG', 'Active', 'Admin', '2023-11-27 17:34:14.755')`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
