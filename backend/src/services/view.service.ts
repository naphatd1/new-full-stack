import prisma from '../lib/prisma';

export const incrementHouseViewCount = async (houseId: string): Promise<number> => {
  const house = await prisma.house.update({
    where: { id: houseId },
    data: {
      viewCount: {
        increment: 1
      }
    },
    select: {
      viewCount: true
    }
  });
  
  return house.viewCount;
};

export const getHouseViewCount = async (houseId: string): Promise<number> => {
  const house = await prisma.house.findUnique({
    where: { id: houseId },
    select: {
      viewCount: true
    }
  });
  
  return house?.viewCount || 0;
};